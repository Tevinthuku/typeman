import React from 'react';

import AppBar from '@material-ui/core/AppBar';

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { motion, AnimateSharedLayout, AnimatePresence } from 'framer-motion';

import Headers from '../components/Header';
import TabLabel from '../components/TabLabel';
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
      {value === index && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      )}
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
    showDataOnly
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
          beginRequestProcessing={beginRequestProcessing}
          setSelectedMethod={setSelectedMethod}
        />
      </AppBar>

      <Paper square className={classes.tabsRoot}>
        <AnimateSharedLayout>
          <Tabs
            TabIndicatorProps={{
              hidden: true
            }}
            value={requestConfigView}
            textColor="inherit"
            onChange={handleChangeRequestConfigView}
            aria-label="select between header or params or the body editor"
          >
            <Tab
              disableRipple
              label={
                <TabLabel
                  layoutId="requestConfigView"
                  value="Headers"
                  isSelected={requestConfigView === 0}
                />
              }
              {...a11yProps(0)}
            />
            <Tab
              disableRipple
              label={
                <TabLabel
                  layoutId="requestConfigView"
                  value="Params"
                  isSelected={requestConfigView === 1}
                />
              }
              {...a11yProps(1)}
            />
            <Tab
              disableRipple
              label={
                <TabLabel
                  layoutId="requestConfigView"
                  value="Body"
                  isSelected={requestConfigView === 2}
                />
              }
              {...a11yProps(2)}
            />
          </Tabs>
        </AnimateSharedLayout>
      </Paper>
      <AnimatePresence>
        <TabPanel key={`simple-tabpanel-1`} value={requestConfigView} index={0}>
          <Headers
            handleDeleteHeader={handleDeleteHeader}
            headers={headers}
            handleEditHeaderItem={handleEditHeaderItem}
            handleAddHeader={handleAddHeader}
          />
        </TabPanel>
        <TabPanel key={`simple-tabpanel-2`} value={requestConfigView} index={1}>
          <Params
            handleEditParam={handleEditParam}
            handleAddParam={handleAddParam}
            params={params}
            handleDeleteParam={handleDeleteParam}
          />
        </TabPanel>
        <TabPanel key={`simple-tabpanel-3`} value={requestConfigView} index={2}>
          <Editor
            height="200px"
            width="100vw"
            value={body}
            handleChangeEditorValue={setBody}
          />
        </TabPanel>
      </AnimatePresence>

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
