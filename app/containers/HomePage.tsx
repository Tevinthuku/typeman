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
import useTransform from '../hooks/useTransform';
import useLocalStorage from '../hooks/useLocalStorage';

// types
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  urlToolbar: {
    backgroundColor: theme.palette.background.paper,
    paddingBottom: theme.spacing(1)
  },
  tabsRoot: {
    backgroundColor: theme.palette.background.paper
  }
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

export default function HomePage() {
  const [showDataOnly, setShowDataOnly] = useLocalStorage<boolean>(
    'showDataOnly',
    false
  );
  const {
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
    url,
    requestState
  } = useRequest();

  const {
    transformState,
    handleEditCode,
    transformTo,
    setTransformPreset
  } = useTransform({
    requestState,
    showDataOnly: Boolean(showDataOnly)
  });

  const classes = useStyles();

  return (
    <div>
      <AppBar elevation={2} className={classes.urlToolbar} position="sticky">
        <URLForm
          url={url}
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
          textColor="inherit"
          onChange={handleChange}
          aria-label="select between header or params or the body editor"
        >
          <Tab label="Headers" {...a11yProps(0)} />
          <Tab label="Params" {...a11yProps(1)} />
          <Tab label="Body" {...a11yProps(2)} />
        </Tabs>
      </Paper>
      <TabPanel value={requestOption} index={0}>
        <Headers
          handleDeleteHeader={handleDeleteHeader}
          headers={headers}
          handleEditHeaderItem={handleEditHeaderItem}
          handleAddHeader={handleAddHeader}
        />
      </TabPanel>
      <TabPanel value={requestOption} index={1}>
        <Params
          handleEditParam={handleEditParam}
          handleAddParam={handleAddParam}
          params={params}
          handleDeleteParam={handleDeleteParam}
        />
      </TabPanel>
      <TabPanel value={requestOption} index={2}>
        <Editor
          height="200px"
          width="100vw"
          value={body}
          handleChangeEditorValue={setBody}
        />
      </TabPanel>

      <ResponseSwitcher
        showDataOnly={showDataOnly}
        setShowDataOnly={setShowDataOnly}
        requestState={requestState}
        handleEditCode={handleEditCode}
        transformState={transformState}
        transformTo={transformTo}
        setTransformPreset={setTransformPreset}
      />
    </div>
  );
}
