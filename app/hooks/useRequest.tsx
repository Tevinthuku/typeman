import React, { useEffect, useState } from 'react';
import Axios, { Method } from 'axios';
import { useImmer } from 'use-immer';
import { v4 as uuidv4 } from 'uuid';

import { Draft } from 'immer';

import useLocalStorage from './useLocalStorage';

import {
  IDObjectItem,
  HeaderType,
  supportedDataTypes,
  HeaderItemType
} from '../types/data';
import { axiosObject } from '../types/request';

const initialHeaders: IDObjectItem = {};

export const methods: Method[] = ['GET', 'POST', 'DELETE', 'PUT'];

const initialAxiosRequest = {
  url: 'https://jsonplaceholder.typicode.com/posts/1',
  method: methods[0],
  headers: {},
  data: {},
  params: {}
};

export type requestStateMachine =
  | {
      status: 'idle';
    }
  | {
      status: 'pending';
    }
  | {
      status: 'request';
    }
  | {
      status: 'Ok::Resolved';
      data: Object;
    }
  | {
      status: 'Ok::Rejected';
      error: Object;
    };

type headersHooks = [
  IDObjectItem,
  (f: (draft: Draft<IDObjectItem>) => void | IDObjectItem) => void
];

type axiosHook = [
  axiosObject,
  (f: (draft: Draft<axiosObject>) => void | axiosObject) => void
];

type RequestStateMachineHook = [
  requestStateMachine,
  (f: (draft: Draft<requestStateMachine>) => void | requestStateMachine) => void
];

type AxiosParamsLocalStorageParams = {
  headers: IDObjectItem;
  params: IDObjectItem;
  body: string;
  selectedMethod: Method;
};

const initialRequestState: requestStateMachine = {
  status: 'idle'
};

function convertStringToNumber(str: string): string | number {
  if (/^[-+]?(\d+|Infinity)$/.test(str)) {
    return Number(str);
  } else {
    return str;
  }
}

const initialAxiosParamsLocalStorageParams = {
  headers: initialHeaders,
  params: initialHeaders,
  body: '',
  selectedMethod: methods[0]
};

export default function useRequest() {
  const [axioslocalStorageParams, setLocalStorageAxiosParams] = useLocalStorage<
    AxiosParamsLocalStorageParams
  >('axiosParams', initialAxiosParamsLocalStorageParams);
  const [storedAxiosRequestObject, setStoredAxiosObject] = useLocalStorage<
    axiosObject
  >('axiosRequestObject', initialAxiosRequest);
  const [headers, setHeaders]: headersHooks = useImmer(
    axioslocalStorageParams.headers
  );
  const [params, setParams]: headersHooks = useImmer(
    axioslocalStorageParams.params
  );
  const [body, setBody] = useState(axioslocalStorageParams.body);
  const [selectedMethod, setSelectedMethod] = React.useState(
    axioslocalStorageParams.selectedMethod
  );
  const [axiosObject, setAxiosObject]: axiosHook = useImmer(
    storedAxiosRequestObject
  );
  const [requestState, setRequestState]: RequestStateMachineHook = useImmer(
    initialRequestState
  );
  const [requestOption, setRequestOption] = useState(0);

  const handleChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
    setRequestOption(newValue);
  };

  const handleAddHeader = (header: HeaderType) => {
    setHeaders(draft => {
      const id = uuidv4();
      draft[id] = {
        ...header,
        id: id
      };
    });
  };

  const handleAddParam = (param: HeaderType) => {
    setHeaders(draft => {
      const uniqueId = uuidv4();
      draft[uniqueId] = {
        ...param,
        id: uniqueId
      };
    });
  };

  const handleURLChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    evt.persist();
    setAxiosObject(draft => {
      draft.url = evt.target.value;
    });
  };

  const handleMakeAPICall = async () => {
    setRequestState(draft => {
      draft.status = 'pending';
    });
    setLocalStorageAxiosParams({
      headers,
      params,
      body,
      selectedMethod
    });
    setAxiosObject(draft => {
      for (const header in headers) {
        const key = headers[header].key;
        draft.headers[key] =
          headers[header].type === 'number'
            ? convertStringToNumber(headers[header].value)
            : String(headers[header].value);
      }
      for (const param in params) {
        const key = params[param].key;
        draft.params[key] =
          params[param].type === 'number'
            ? convertStringToNumber(params[param].value)
            : String(params[param].value);
      }

      try {
        draft.data = JSON.parse(body);
      } catch (err) {}
      draft.method = selectedMethod;
    });

    setRequestState(draft => {
      draft.status = 'request';
    });
  };

  useEffect(() => {
    if (requestState.status === 'request') {
      async function loadData() {
        try {
          setStoredAxiosObject(axiosObject);
          const data = await Axios(axiosObject);
          setRequestState(() => ({
            status: 'Ok::Resolved',
            data
          }));
        } catch (error) {
          setRequestState(() => ({
            status: 'Ok::Rejected',
            error
          }));
        }
      }
      loadData();
    }
  }, [requestState.status, axiosObject, setRequestState, setStoredAxiosObject]);

  const handleEditHeaderItem = (id: string) => (
    prop: 'key' | 'value' | 'type'
  ) => (value: string | HeaderItemType) => {
    setHeaders(draft => {
      if (prop === 'type') {
        if (
          supportedDataTypes[0] === value ||
          supportedDataTypes[1] === value
        ) {
          const itemToBeEdited = draft[id];
          if (itemToBeEdited) itemToBeEdited[prop] = value;
        }
      } else {
        const itemToBeEdited = draft[id];
        if (itemToBeEdited) itemToBeEdited[prop] = value;
      }
    });
  };
  const handleEditParam = (id: string) => (prop: 'key' | 'value' | 'type') => (
    value: string | HeaderItemType
  ) => {
    setParams(draft => {
      if (prop === 'type') {
        if (
          supportedDataTypes[0] === value ||
          supportedDataTypes[1] === value
        ) {
          const itemToBeEdited = draft[id];
          if (itemToBeEdited) itemToBeEdited[prop] = value;
        }
      } else {
        const itemToBeEdited = draft[id];
        if (itemToBeEdited) itemToBeEdited[prop] = value;
      }
    });
  };

  const handleDeleteHeader = (id: string) => () => {
    setHeaders(draft => {
      delete draft[id];
    });
  };

  const handleDeleteParam = (id: string) => () => {
    setParams(draft => {
      delete draft[id];
    });
  };

  return {
    handleChange,
    handleDeleteHeader,
    handleDeleteParam,
    handleEditParam,
    handleEditHeaderItem,
    handleMakeAPICall,
    handleURLChange,
    handleAddHeader,
    handleAddParam,
    setBody,
    setSelectedMethod,
    requestOption,
    headers,
    params,
    body,
    selectedMethod,
    axiosObject,
    requestState
  };
}
