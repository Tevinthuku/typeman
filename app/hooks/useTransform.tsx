import { useState, useEffect, useMemo } from 'react';
import { useImmer } from 'use-immer';
import { json2ts } from 'json-ts';

import { requestStateMachine } from './useRequest';

type TransformOption =
  | {
      to: 'flow';
    }
  | {
      to: 'typescript';
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
  const [transformTo, setTransformPreset] = useState<TransformOption>({
    to: 'flow'
  });

  const [transformState, setTransformState] = useImmer<TransformStateMachine>({
    status: 'pendingTransformation'
  });

  const dataToBeTransformed = useMemo(() => {
    if (requestState.status === 'Ok::Rejected') {
      if (requestState.error.response && showDataOnly) {
        const { status, data } = requestState.error.response;
        return { status, data };
      }
      return requestState.error;
    }

    if (requestState.status === 'Ok::Resolved') {
      if (requestState.data && showDataOnly) {
        const { status, data } = requestState.data;
        return { status, data };
      }
      return requestState.data;
    }

    return {};
  }, [requestState, showDataOnly]);

  useEffect(() => {
    if (
      requestState.status === 'Ok::Resolved' ||
      requestState.status === 'Ok::Rejected'
    ) {
      const { data, status } = dataToBeTransformed;
      if (transformTo.to === 'flow') {
        setTransformState(() => ({
          status: 'transformed',
          statusCode: status,
          typesToDisplay: json2ts(JSON.stringify(data || '', null, 2), {
            flow: true,
            prefix: ''
          }),
          dataToDisplay: JSON.stringify(data || '', null, 2)
        }));
      }

      if (transformTo.to === 'typescript') {
        setTransformState(() => ({
          status: 'transformed',
          statusCode: status,
          typesToDisplay: json2ts(JSON.stringify(data || '', null, 2), {
            prefix: ''
          }),
          dataToDisplay: JSON.stringify(data || '', null, 2)
        }));
      }
    }
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

  return { setTransformPreset, transformState, handleEditCode };
}
