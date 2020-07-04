import React from 'react';
import {
  makeStyles,
  Theme,
  createStyles,
  withStyles
} from '@material-ui/core/styles';
import clsx from 'clsx';
import Stepper from '@material-ui/core/Stepper';
import Grid from '@material-ui/core/Grid';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import WebIcon from '@material-ui/icons/PublicOutlined';
import VideoLabelIcon from '@material-ui/icons/VideoLabel';
import StepConnector from '@material-ui/core/StepConnector';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { StepIconProps } from '@material-ui/core/StepIcon';
import { Link } from 'react-router-dom';

const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 22
  },
  active: {
    '& $line': {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)'
    }
  },
  completed: {
    '& $line': {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)'
    }
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1
  }
})(StepConnector);

const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  active: {
    backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)'
  },
  completed: {
    backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)'
  }
});

function ColorlibStepIcon(props: StepIconProps) {
  const classes = useColorlibStepIconStyles();
  const { active, completed } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <DownloadIcon />,
    2: <GroupAddIcon />,
    3: <VideoLabelIcon />
  };

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed
      })}
    >
      {icons[String(props.icon)]}
    </div>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%'
    },
    button: {
      marginRight: theme.spacing(1)
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1)
    },
    buttonsContainer: {
      marginTop: theme.spacing(2)
    },
    unsplashLink: {
      color: theme.palette.text.primary
    }
  })
);

function getSteps() {
  return [
    'Download the app or use web version',
    'Type in your endpoint url & required data',
    'Run your endpoint & get your results'
  ];
}

function getStepContent(step: number) {
  switch (step) {
    case 0:
      return `You can get the latest builds for
      windows/mac/linux from the download links provided
      below or you can use the hosted web version
      of this app by clicking on the Workspace link`;
    case 1:
      return `Type in your endpoint URL and the data required to access the endpoint.
        It could be headers, parameters or the body field. Works just like Postman`;
    case 2:
      return `Hit the SEND button to see results of the
              type definitions of your data & also the data
              itself if you want to. Using the data-only toggle you can select if you just want to see the data itself or the data + all the headers and other meta data returned by the endpoint.`;
    default:
      return 'Unknown step';
  }
}

export default function CustomizedSteppers() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className={classes.root}>
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        connector={<ColorlibConnector />}
      >
        {steps.map(label => (
          <Step key={label}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              Get started on your Type Driven Development productivity journey.
            </Typography>
            <Button onClick={handleReset} className={classes.button}>
              Reset
            </Button>
          </div>
        ) : (
          <div>
            <Typography className={classes.instructions}>
              {getStepContent(activeStep)}
            </Typography>
            <div>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.button}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={classes.button}
              >
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
        )}

        <Grid container spacing={4} className={classes.buttonsContainer}>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="outlined"
              className={classes.button}
              component={Link}
              to="/workspace"
              startIcon={<WebIcon />}
            >
              Web Workspace
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="outlined"
              className={classes.button}
              component="a"
              target="_blank"
              startIcon={<DownloadIcon />}
              href="https://drive.google.com/drive/folders/1-ZG2_E0g3wDjUlmh-JQTbG_lvv4cBEuY?usp=sharing"
            >
              Download app
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              component="a"
              target="_blank"
              href="https://github.com/Tevinthuku/typeman"
            >
              View source code
            </Button>
          </Grid>
        </Grid>
        <div className={classes.buttonsContainer}>
          <Typography
            component="a"
            target="_blank"
            href="https://unsplash.com/"
            variant="overline"
            align="center"
            className={classes.unsplashLink}
          >
            Random Images Provided by Unsplash
          </Typography>
        </div>
      </div>
    </div>
  );
}
