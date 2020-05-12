import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

import Editor from '../Editor';

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
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: 224
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`
  }
}));

type Props = {
  typeResponse: string;
  dataResponse: string;
  handleEditCode: (
    type: 'dataResponse' | 'typeResponse'
  ) => (s: string) => void;
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
      <TabPanel value={value} index={0}>
        <Editor
          value={props.typeResponse}
          handleChangeEditorValue={props.handleEditCode('typeResponse')}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Editor
          value={props.dataResponse}
          handleChangeEditorValue={props.handleEditCode('dataResponse')}
        />
      </TabPanel>
    </div>
  );
}
