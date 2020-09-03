import React, { useEffect, useState } from 'react';
import Axios, { Method, AxiosError, AxiosRequestConfig } from 'axios';
import { useImmer } from 'use-immer';
import { v4 as uuidv4 } from 'uuid';

import useLocalStorage from './useLocalStorage';

import { IDObjectItem, HeaderType, AxiosHeaderParamType } from '../types/data';

const initialHeaders: IDObjectItem = {};

export const methods: Method[] = ['GET', 'POST', 'DELETE', 'PUT'];

export type requestResultState =
  | {
      status: 'Ok::Resolved';
      data: {
        status: number;
        data: Object;
      };
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
      status: 'request';
      requestObject: AxiosRequestConfig;
    }
  | requestResultState;

type AxiosParamsLocalStorageParams = {
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

const initialAxiosParamsLocalStorageParams = {
  url: 'https://jsonplaceholder.typicode.com/posts/1',
  headers: initialHeaders,
  params: initialHeaders,
  body: '',
  selectedMethod: methods[0]
};

export default function useRequest() {
  const [axioslocalStorageParams, setLocalStorageAxiosParams] = useLocalStorage<
    AxiosParamsLocalStorageParams
  >('axiosParams', initialAxiosParamsLocalStorageParams);

  const [headers, setHeaders] = useImmer<IDObjectItem>(
    axioslocalStorageParams.headers
  );
  const [params, setParams] = useImmer<IDObjectItem>(
    axioslocalStorageParams.params
  );
  const [body, setBody] = useState(axioslocalStorageParams.body);
  const [url, setUrl] = useState(axioslocalStorageParams.url);
  const [selectedMethod, setSelectedMethod] = React.useState(
    axioslocalStorageParams.selectedMethod
  );

  const [requestState, setRequestState] = useImmer<requestStateMachine>(
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
    setParams(draft => {
      const uniqueId = uuidv4();
      draft[uniqueId] = {
        ...param,
        id: uniqueId
      };
    });
  };

  const handleURLChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    evt.persist();
    setUrl(() => evt.target.value);
  };

  const handleMakeAPICall = async () => {
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
      headers: {},
      params: {},
      data: {}
    };
    for (const header in headers) {
      const key = headers[header].key;
      requestObject.headers[key] = convertStringToNumberIfNecessary(
        headers[header].value
      );
    }
    for (const param in params) {
      const key = params[param].key;
      requestObject.params[key] = convertStringToNumberIfNecessary(
        params[param].value
      );
    }

    console.log(requestObject);
    try {
      requestObject.data = JSON.parse(body);
    } catch (err) {}
    requestObject.method = selectedMethod;

    setRequestState(() => ({
      status: 'request',
      requestObject
    }));
  };

  useEffect(() => {
    if (requestState.status === 'request') {
      async function loadData(reqObject: AxiosRequestConfig) {
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
      loadData(requestState.requestObject);
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
    url,
    selectedMethod,
    requestState
  };
}
