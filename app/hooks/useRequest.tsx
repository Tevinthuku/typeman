import React, { useEffect, useState } from 'react';
import Axios, {
  Method,
  AxiosError,
  AxiosResponse,
  AxiosRequestConfig
} from 'axios';
import { useImmer } from 'use-immer';
import { v4 as uuidv4 } from 'uuid';

import useLocalStorage from './useLocalStorage';

import { IDObjectItem, HeaderType, AxiosHeaderParamType } from '../types/data';

export const methods: Method[] = ['GET', 'POST', 'DELETE', 'PUT'];

export type requestResultState =
  | {
      status: 'Ok::Resolved';
      data: AxiosResponse<Object>;
    }
  | {
      status: 'Ok::Rejected';
      error: AxiosError;
    };

export type requestStateMachine =
  | {
      status: 'idle';
    }
  | {
      status: 'pending';
    }
  | {
      status: 'makeRequest';
      requestObject: AxiosRequestConfig;
    }
  | requestResultState;

type AxiosLocalStorageParams = {
  url: string;
  headers: IDObjectItem;
  params: IDObjectItem;
  body: string;
  selectedMethod: Method;
};

const initialRequestState: requestStateMachine = {
  status: 'idle'
};

function convertStringToNumberIfNecessary(str: string): string | number {
  if (/^[-+]?(\d+|Infinity)$/.test(str)) {
    return Number(str);
  } else {
    return str;
  }
}

const initialAxiosLocalStorageParams = {
  url: 'https://jsonplaceholder.typicode.com/posts/1',
  headers: {},
  params: {},
  body: '',
  selectedMethod: methods[0]
};

export default function useRequest() {
  const [axioslocalStorageParams, setLocalStorageAxiosParams] = useLocalStorage<
    AxiosLocalStorageParams
  >('axiosParams', initialAxiosLocalStorageParams);

  const [headers, setHeaders] = useImmer<IDObjectItem>(
    axioslocalStorageParams.headers
  );
  const [params, setParams] = useImmer<IDObjectItem>(
    axioslocalStorageParams.params
  );
  const [body, setBody] = useState(axioslocalStorageParams.body);
  const [url, setUrl] = useState(axioslocalStorageParams.url);
  const [selectedMethod, setSelectedMethod] = useState(
    axioslocalStorageParams.selectedMethod
  );

  const [requestState, setRequestState] = useImmer<requestStateMachine>(
    initialRequestState
  );
  const [requestConfigView, setRequestConfigView] = useState(0);

  const handleChangeRequestConfigView = (
    _event: React.ChangeEvent<{}>,
    newValue: number
  ) => {
    setRequestConfigView(newValue);
  };

  const handleAddHeader = (header: HeaderType) => {
    setHeaders(draft => {
      const id = uuidv4();
      draft[id] = header;
    });
  };

  const handleAddParam = (param: HeaderType) => {
    setParams(draft => {
      const uniqueId = uuidv4();
      draft[uniqueId] = param;
    });
  };

  const handleURLChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    evt.persist();
    setUrl(() => evt.target.value);
  };

  const formatObjectItem = (object: IDObjectItem) => {
    let result: { [a: string]: any } = {};
    for (const item in object) {
      const key = object[item].key;
      result[key] = convertStringToNumberIfNecessary(object[item].value);
    }
    return result;
  };

  const beginRequestProcessing = () => {
    setRequestState(() => ({
      status: 'pending'
    }));
    setLocalStorageAxiosParams({
      url,
      headers,
      params,
      body,
      selectedMethod
    });
    const requestObject: AxiosRequestConfig = {
      url,
      headers: formatObjectItem(headers),
      params: formatObjectItem(params),
      data: {}
    };
    try {
      requestObject.data = JSON.parse(body);
    } catch (err) {}
    requestObject.method = selectedMethod;

    setRequestState(() => ({
      status: 'makeRequest',
      requestObject
    }));
  };

  useEffect(() => {
    if (requestState.status === 'makeRequest') {
      async function performRequest(reqObject: AxiosRequestConfig) {
        try {
          const data = await Axios(reqObject);
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
      performRequest(requestState.requestObject);
    }
  }, [requestState, setRequestState]);

  const handleEditHeaderItem = (id: string) => (
    propObject: AxiosHeaderParamType
  ) => {
    setHeaders(draft => {
      const item = draft[id];
      if (item) item[propObject.item] = propObject.itemValue;
    });
  };
  const handleEditParam = (id: string) => (
    propObject: AxiosHeaderParamType
  ) => {
    setParams(draft => {
      const item = draft[id];
      if (item) item[propObject.item] = propObject.itemValue;
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
    handleChangeRequestConfigView,
    handleDeleteHeader,
    handleDeleteParam,
    handleEditParam,
    handleEditHeaderItem,
    beginRequestProcessing,
    handleURLChange,
    handleAddHeader,
    handleAddParam,
    setBody,
    setSelectedMethod,
    requestConfigView,
    headers,
    params,
    body,
    url,
    selectedMethod,
    requestState
  };
}
