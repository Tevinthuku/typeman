import React, { ReactNode } from 'react';
import { useHistory } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import { makeStyles } from '@material-ui/core';

import Lambda from '../components/LambdaIcon';

const useStyles = makeStyles(() => ({
  title: {
    fontSize: '1.25rem',
    fontWeight: 'bolder'
  }
}));

type Props = {
  children: ReactNode;
};

export default function App(props: Props) {
  const { children } = props;
  const classes = useStyles();
  const { push } = useHistory();

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => push('/')}
          >
            <Lambda />
          </IconButton>
          <Typography className={classes.title} variant="h1">
            Typeman
          </Typography>
        </Toolbar>
      </AppBar>
      {children}
    </>
  );
}
