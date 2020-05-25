import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

import Editor from '../Editor';
import LoadingResults from '../Loading';

import { TransformStateMachine } from '../../hooks/useTransform';
import { requestStateMachine } from '../../hooks/useRequest';

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
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    height: 224,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`
  }
}));

type Props = {
  handleEditCode: (
    type: 'dataResponse' | 'typeResponse'
  ) => (s: string) => void;
  transformState: TransformStateMachine;
  requestState: requestStateMachine;
};

export default function ResponseSwitcher(props: Props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        className={classes.tabs}
      >
        <Tab label="Types" {...a11yProps(0)} />
        <Tab label="Data" {...a11yProps(1)} />
      </Tabs>

      {props.requestState.status === 'idle' && (
        <>
          <TabPanel value={value} index={0}>
            <Editor value={''} handleChangeEditorValue={() => {}} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Editor value={''} handleChangeEditorValue={() => {}} />
          </TabPanel>
        </>
      )}

      {(props.requestState.status === 'pending' ||
        props.requestState.status === 'request') && (
        <div
          style={{
            width: '100%'
          }}
        >
          <TabPanel value={value} index={0}>
            <LoadingResults />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <LoadingResults />
          </TabPanel>
        </div>
      )}
      {props.transformState.status === 'transformed' &&
        (props.requestState.status === 'Ok::Rejected' ||
          props.requestState.status === 'Ok::Resolved') && (
          <>
            <TabPanel value={value} index={0}>
              <Editor
                value={props.transformState.typesToDisplay || ''}
                handleChangeEditorValue={props.handleEditCode('typeResponse')}
              />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Editor
                value={props.transformState.dataToDisplay || ''}
                handleChangeEditorValue={props.handleEditCode('dataResponse')}
              />
            </TabPanel>
          </>
        )}
    </div>
  );
}
