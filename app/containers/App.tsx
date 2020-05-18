import React, { ReactNode } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';

import Lambda from '../components/LambdaIcon';

type Props = {
  children: ReactNode;
};

export default function App(props: Props) {
  const { children } = props;
  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Lambda />
          </IconButton>
          <Typography variant="h6">Typeman</Typography>
        </Toolbar>
      </AppBar>
      {children}
    </>
  );
}
