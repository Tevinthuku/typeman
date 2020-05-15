import React, { useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import { Draft } from 'immer';
import { v4 as uuidv4 } from 'uuid';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import IconButton from '@material-ui/core/IconButton';

import { json2ts } from 'json-ts';
import Axios, { Method } from 'axios';

import {
  CompleteItem,
  HeaderType,
  supportedDataTypes,
  HeaderItemType
} from '../components/FieldsContainer';
import Headers from '../components/Header';
import Params from '../components/Params';
import URLForm from '../components/URLForm';
import Editor from '../components/Editor';
import ResponseSwitcher from '../components/ResponseSwitcher';

import Lambda from '../components/LambdaIcon';

// types
import { axiosObject } from '../types/request';
import { makeStyles } from '@material-ui/core';

type headersHooks = [
  CompleteItem[],
  (f: (draft: Draft<CompleteItem[]>) => void | CompleteItem[]) => void
];

type axiosHook = [
  axiosObject,
  (f: (draft: Draft<axiosObject>) => void | axiosObject) => void
];

const initialHeaders: CompleteItem[] = [];

const methods: Method[] = ['GET', 'POST', 'DELETE', 'PUT'];

const initialAxiosRequest = {
  url: 'https://jsonplaceholder.typicode.com/posts/1',
  method: methods[0],
  headers: {},
  data: {},
  params: {}
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

function convertStringToNumber(str: string): string | number {
  if (/^[-+]?(\d+|Infinity)$/.test(str)) {
    return Number(str);
  } else {
    return str;
  }
}

const useStyles = makeStyles(theme => ({
  urlToolbar: {
    backgroundColor: theme.palette.background.paper,
    paddingBottom: theme.spacing(1)
  }
}));

export default function HomePage() {
  const [headers, setHeaders]: headersHooks = useImmer(initialHeaders);
  const [params, setParams]: headersHooks = useImmer(initialHeaders);
  const [body, setBody] = useState('');
  const [selectedMethod, setSelectedMethod] = React.useState(methods[0]);
  const [axiosObject, setAxiosObject]: axiosHook = useImmer(
    initialAxiosRequest
  );
  const [requestState, setRequestState]: RequestStateMachineHook = useImmer(
    initialRequestState
  );
  const [requestOption, setRequestOption] = React.useState(0);
  const classes = useStyles();
  const handleChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
    setRequestOption(newValue);
  };

  const handleAddHeader = (header: HeaderType) => {
    setHeaders(draft => {
      draft.push({ ...header, id: uuidv4() });
    });
  };

  const handleAddParam = (param: HeaderType) => {
    setHeaders(draft => {
      draft.push({ ...param, id: uuidv4() });
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
        draft.headers[headers[i].key] =
          headers[i].type === 'number'
            ? convertStringToNumber(headers[i].value)
            : String(headers[i].value);
    });
    setAxiosObject(draft => {
      for (let i = 0; i < params.length; i++)
        draft.params[params[i].key] =
          params[i].type === 'number'
            ? convertStringToNumber(params[i].value)
            : String(params[i].value);
    });

    setAxiosObject(draft => {
      try {
        draft.data = JSON.parse(body);
      } catch (err) {}
      draft.method = selectedMethod;
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
              flow: true,
              prefix: ''
            }),
            dataResponse: JSON.stringify(data, null, 2)
          }));
        } catch (error) {
          const err = error.response || error;
          setRequestState(() => ({
            status: 'rejected',
            typeResponse: json2ts(JSON.stringify(err, null, 2), {
              flow: true,
              prefix: ''
            }),
            dataResponse: JSON.stringify(err, null, 2)
          }));
        }
      }
      loadData();
    }
  }, [requestState.status, axiosObject, setRequestState]);

  const handleEditHeaderItem = (id: string) => (
    prop: 'key' | 'value' | 'type'
  ) => (value: string | HeaderItemType) => {
    setHeaders(draft => {
      if (prop === 'type') {
        if (
          supportedDataTypes[0] === value ||
          supportedDataTypes[1] === value
        ) {
          const itemToBeEdited = draft.find(d => d.id === id);
          if (itemToBeEdited) itemToBeEdited[prop] = value;
        }
      } else {
        const itemToBeEdited = draft.find(d => d.id === id);
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
          const itemToBeEdited = draft.find(d => d.id === id);
          if (itemToBeEdited) itemToBeEdited[prop] = value;
        }
      } else {
        const itemToBeEdited = draft.find(d => d.id === id);
        if (itemToBeEdited) itemToBeEdited[prop] = value;
      }
    });
  };

  const handleDeleteHeader = (id: string) => () => {
    setHeaders(draft => {
      draft.splice(
        draft.findIndex(header => header.id === id),
        1
      );
    });
  };

  const handleDeleteParam = (id: string) => () => {
    setParams(draft => {
      draft.splice(
        draft.findIndex(header => header.id === id),
        1
      );
    });
  };

  return (
    <div>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Lambda />
          </IconButton>
          <Typography variant="h6">Typeman</Typography>
        </Toolbar>
      </AppBar>
      <AppBar elevation={2} className={classes.urlToolbar} position="sticky">
        <URLForm
          axiosObject={axiosObject}
          handleURLChange={handleURLChange}
          methods={methods}
          selectedMethod={selectedMethod}
          handleMakeAPICall={handleMakeAPICall}
          setSelectedMethod={setSelectedMethod}
        />
      </AppBar>

      <Paper square>
        <Tabs
          value={requestOption}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
          aria-label="disabled tabs example"
        >
          <Tab label="Headers" />
          <Tab label="Params" />
          <Tab label="Body" />
        </Tabs>
      </Paper>
      {requestOption === 0 && (
        <Headers
          handleDeleteHeader={handleDeleteHeader}
          headers={headers}
          handleEditHeaderItem={handleEditHeaderItem}
          handleAddHeader={handleAddHeader}
        />
      )}
      {requestOption === 1 && (
        <Params
          handleEditParam={handleEditParam}
          handleAddParam={handleAddParam}
          params={params}
          handleDeleteParam={handleDeleteParam}
        />
      )}
      {requestOption === 2 && (
        <Editor height="200px" value={body} handleChangeEditorValue={setBody} />
      )}

      <ResponseSwitcher
        handleEditCode={handleEditCode}
        typeResponse={
          requestState.status === 'resolved' ||
          requestState.status === 'rejected'
            ? requestState.typeResponse
            : ''
        }
        dataResponse={
          requestState.status === 'resolved' ||
          requestState.status === 'rejected'
            ? requestState.dataResponse
            : ''
        }
      />
    </div>
  );
}
