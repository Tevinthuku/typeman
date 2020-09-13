import { useEffect, useCallback } from 'react';
import { useImmer } from 'use-immer';
import { json2ts } from 'json-ts';

import { requestStateMachine, requestResultState } from './useRequest';
import useLocalStorage from './useLocalStorage';

export type TransformationKeys = 'flow' | 'typescript' | 'kotlin';

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
  const [transformTo, setTransformPreset] = useLocalStorage<TransformationKeys>(
    'transformPreset',
    'flow'
  );

  const [transformState, setTransformState] = useImmer<TransformStateMachine>({
    status: 'pendingTransformation'
  });

  const formatFetchedData = useCallback(
    (requestState: requestResultState) => {
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
              message: requestState.error.message
            },
            status: 500
          };
        }
      }

      if (showDataOnly) {
        const { status, data } = requestState.data;
        return { status, data };
      }
      return { data: requestState.data, status: requestState.data.status };
    },
    [showDataOnly]
  );

  useEffect(() => {
    if (
      requestState.status === 'Ok::Resolved' ||
      requestState.status === 'Ok::Rejected'
    ) {
      const { data, status } = formatFetchedData(requestState);
      if (transformTo === 'flow' || transformTo === 'typescript') {
        setTransformState(() => ({
          status: 'transformed',
          statusCode: status,
          typesToDisplay: json2ts(JSON.stringify(data || '', null, 2), {
            flow: transformTo === 'flow',
            prefix: ''
          }),
          dataToDisplay: JSON.stringify(data || '', null, 2)
        }));
      }
    }
  }, [requestState, transformTo, setTransformState, formatFetchedData]);

  const handleEditCode = (type: 'dataResponse' | 'typeResponse') => (
    code: string
  ) => {
    setTransformState((draft: TransformStateMachine) => {
      if (draft.status === 'transformed') {
        if (type === 'dataResponse') draft.dataToDisplay = code;
        if (type === 'typeResponse') draft.typesToDisplay = code;
      }
    });
  };

  return { setTransformPreset, transformState, handleEditCode, transformTo };
}
