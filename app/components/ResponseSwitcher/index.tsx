import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import Copy from '@material-ui/icons/FileCopyOutlined';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Editor from '../Editor';
import LoadingResults from '../Loading';

import {
  TransformStateMachine,
  TransformPresetObject
} from '../../hooks/useTransform';
import { requestStateMachine } from '../../hooks/useRequest';
import TransformPresetSelector from '../TransformPresetSelector';

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
  },
  configurationContainer: {
    paddingLeft: theme.spacing(4)
  },
  contentGridItem: {
    width: '100%'
  }
}));

type Props = {
  handleEditCode: (
    type: 'dataResponse' | 'typeResponse'
  ) => (s: string) => void;
  transformState: TransformStateMachine;
  requestState: requestStateMachine;
  setShowDataOnly: (s: boolean) => void;
  showDataOnly: boolean | void | null;
  transformTo: TransformPresetObject;
  setTransformPreset: (t: TransformPresetObject) => void;
};

export default function ResponseSwitcher(props: Props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  const handleClose = (_event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  const handleChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeDataToBeDisplayed = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.persist();
    props.setShowDataOnly(event.target.checked);
  };

  const handleCopyTypeData = (data: string) => () => {
    navigator.clipboard.writeText(data).then(() => {
      setOpen(true);
    });
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
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Successfully copied to clipboard"
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
      >
        <Grid item className={classes.configurationContainer}>
          <Grid container spacing={3}>
            <Grid item>
              <FormControlLabel
                control={
                  <Switch
                    checked={Boolean(props.showDataOnly)}
                    onChange={handleChangeDataToBeDisplayed}
                    name="checkedB"
                    color="primary"
                  />
                }
                label="Data Only"
              />
            </Grid>
            <Grid item>
              {props.transformState.status === 'transformed' &&
                (props.requestState.status === 'Ok::Rejected' ||
                  props.requestState.status === 'Ok::Resolved') && (
                  <Button>{props.transformState.statusCode}</Button>
                )}
            </Grid>
            <Grid item>
              <TransformPresetSelector
                transformTo={props.transformTo}
                setTransformPreset={props.setTransformPreset}
              />
            </Grid>
            <Grid item>
              {props.transformState.status === 'transformed' &&
                (props.requestState.status === 'Ok::Rejected' ||
                  props.requestState.status === 'Ok::Resolved') && (
                  <Button
                    onClick={handleCopyTypeData(
                      props.transformState.typesToDisplay
                    )}
                    endIcon={<Copy />}
                  >
                    Copy Type Results
                  </Button>
                )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item className={classes.contentGridItem}>
          <>
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
              props.requestState.status === 'makeRequest') && (
              <div className={classes.contentGridItem}>
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
                      handleChangeEditorValue={props.handleEditCode(
                        'typeResponse'
                      )}
                    />
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    <Editor
                      value={props.transformState.dataToDisplay || ''}
                      handleChangeEditorValue={props.handleEditCode(
                        'dataResponse'
                      )}
                    />
                  </TabPanel>
                </>
              )}
          </>
        </Grid>
      </Grid>
    </div>
  );
}
