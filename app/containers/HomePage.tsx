import React from 'react';

import AppBar from '@material-ui/core/AppBar';

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Headers from '../components/Header';
import Params from '../components/Params';
import URLForm from '../components/URLForm';
import Editor from '../components/Editor';
import ResponseSwitcher from '../components/ResponseSwitcher';

import useRequest, { methods } from '../hooks/useRequest';

// types
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  urlToolbar: {
    backgroundColor: theme.palette.background.paper,
    paddingBottom: theme.spacing(1)
  },
  tabsRoot: {
    backgroundColor: theme.palette.background.default
  }
}));

export default function HomePage() {
  const {
    handleChange,
    handleDeleteHeader,
    handleDeleteParam,
    handleEditParam,
    handleEditHeaderItem,
    handleEditCode,
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
  } = useRequest();

  const classes = useStyles();

  return (
    <div>
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

      <Paper square className={classes.tabsRoot}>
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
        <Editor
          height="200px"
          width="100vw"
          value={body}
          handleChangeEditorValue={setBody}
        />
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
