import React, { useState, useEffect } from 'react';
import { useImmer } from 'use-immer';
import { Draft } from 'immer';
import { v4 as uuidv4 } from 'uuid';

import { json2ts } from 'json-ts';
import Axios, { Method } from 'axios';

import Headers, { HeaderType, CompleteHeader } from '../components/Header';
import URLForm from '../components/URLForm';
import ResponseSwitcher from '../components/ResponseSwitcher';

// types
import { axiosObject } from '../types/request';

type headersHooks = [
  CompleteHeader[],
  (f: (draft: Draft<CompleteHeader[]>) => void | CompleteHeader[]) => void
];

type axiosHook = [
  axiosObject,
  (f: (draft: Draft<axiosObject>) => void | axiosObject) => void
];

const initialHeaders: CompleteHeader[] = [];

const methods: Method[] = ['GET', 'POST', 'DELETE', 'PUT'];

const initialAxiosRequest = {
  url: 'https://jsonplaceholder.typicode.com/posts/1',
  method: methods[0],
  headers: {},
  body: {}
};

type requestStateMachine =
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
      status: 'resolved';
      typeResponse: string;
      dataResponse: string;
    }
  | {
      status: 'rejected';
      typeResponse: string;
      dataResponse: string;
    };

type RequestStateMachineHook = [
  requestStateMachine,
  (f: (draft: Draft<requestStateMachine>) => void | requestStateMachine) => void
];

const initialRequestState: requestStateMachine = {
  status: 'idle'
};

export default function HomePage() {
  const [headers, setHeaders]: headersHooks = useImmer(initialHeaders);
  const [selectedMethod, setSelectedMethod] = React.useState(methods[0]);
  const [axiosObject, setAxiosObject]: axiosHook = useImmer(
    initialAxiosRequest
  );

  const [requestState, setRequestState]: RequestStateMachineHook = useImmer(
    initialRequestState
  );
  const handleAddHeader = (header: HeaderType) => {
    setHeaders(draft => {
      draft.push({ ...header, id: uuidv4() });
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
    setAxiosObject(draft => {
      for (let i = 0; i < headers.length; i++)
        draft.headers[headers[i].key] = headers[i].value;
    });

    setRequestState(draft => {
      draft.status = 'request';
    });
  };

  const handleEditCode = (type: 'dataResponse' | 'typeResponse') => (
    code: string
  ) => {
    setRequestState(draft => {
      if (draft.status === 'resolved') draft[type] = code;
    });
  };
  useEffect(() => {
    if (requestState.status === 'request') {
      async function loadData() {
        try {
          const data = await Axios(axiosObject);
          setRequestState(() => ({
            status: 'resolved',
            typeResponse: json2ts(JSON.stringify(data, null, 2), {
              flow: true
            }),
            dataResponse: JSON.stringify(data, null, 2)
          }));
        } catch (err) {
          setRequestState(() => ({
            status: 'rejected',
            typeResponse: json2ts(JSON.stringify(err, null, 2), { flow: true }),
            dataResponse: JSON.stringify(err, null, 2)
          }));
        }
      }
      loadData();
    }
  }, [requestState.status, axiosObject, setRequestState]);

  return (
    <div>
      <URLForm
        axiosObject={axiosObject}
        handleURLChange={handleURLChange}
        methods={methods}
        selectedMethod={selectedMethod}
        handleMakeAPICall={handleMakeAPICall}
        setSelectedMethod={setSelectedMethod}
      />
      <Headers headers={headers} handleAddHeader={handleAddHeader} />
      {(requestState.status === 'rejected' ||
        requestState.status === 'resolved') && (
        <ResponseSwitcher
          handleEditCode={handleEditCode}
          typeResponse={requestState.typeResponse}
          dataResponse={requestState.dataResponse}
        />
      )}
    </div>
  );
}
