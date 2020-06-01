import { useEffect, useMemo } from 'react';
import { useImmer } from 'use-immer';

import { requestStateMachine } from './useRequest';
import useLocalStorage from './useLocalStorage';

export type TransformationKeys = 'flow' | 'typescript' | 'kotlin';

export type TransformPresetObject = {
  to: TransformationKeys;
};

export type TransformStateMachine =
  | {
      status: 'pendingTransformation';
    }
  | {
      status: 'transformed';
      typesToDisplay: string;
      dataToDisplay: string;
      statusCode: number;
    };

type Props = {
  requestState: requestStateMachine;
  showDataOnly: boolean;
};

export default function useTransform({
  requestState,
  showDataOnly = true
}: Props) {
  const [transformTo, setTransformPreset] = useLocalStorage<
    TransformPresetObject
  >('transformPreset', {
    to: 'flow'
  });

  const [transformState, setTransformState] = useImmer<TransformStateMachine>({
    status: 'pendingTransformation'
  });

  const dataToBeTransformed = useMemo(() => {
    if (requestState.status === 'Ok::Rejected') {
      if (requestState.error.response) {
        if (showDataOnly) {
          const { status, data } = requestState.error.response;
          return { status, data };
        } else {
          return {
            data: requestState.error.response,
            status: requestState.error.response.status
          };
        }
      } else {
        return {
          data: {
            message:
              requestState.error.message || 'net::ERR_INTERNET_DISCONNECTED'
          },
          status: requestState.error.status || 500
        };
      }
    }

    if (requestState.status === 'Ok::Resolved') {
      if (requestState.data && showDataOnly) {
        const { status, data } = requestState.data;
        return { status, data };
      }
      return { data: requestState.data, status: requestState.data.status };
    }

    return {};
  }, [requestState, showDataOnly]);

  useEffect(() => {
    async function performTransform() {
      if (
        requestState.status === 'Ok::Resolved' ||
        requestState.status === 'Ok::Rejected'
      ) {
        const { data, status } = dataToBeTransformed;
        if (transformTo.to === 'flow' || transformTo.to === 'typescript') {
          const { json2ts } = await import('json-ts');
          setTransformState(() => ({
            status: 'transformed',
            statusCode: status,
            typesToDisplay: json2ts(JSON.stringify(data || '', null, 2), {
              flow: transformTo.to === 'flow',
              prefix: ''
            }),
            dataToDisplay: JSON.stringify(data || '', null, 2)
          }));
        }
      }
    }
    performTransform();
  }, [requestState, transformTo, setTransformState, dataToBeTransformed]);

  const handleEditCode = (type: 'dataResponse' | 'typeResponse') => (
    code: string
  ) => {
    setTransformState(draft => {
      if (draft.status === 'transformed') {
        if (type === 'dataResponse') draft.dataToDisplay = code;
        if (type === 'typeResponse') draft.typesToDisplay = code;
      }
    });
  };

  return { setTransformPreset, transformState, handleEditCode, transformTo };
}
