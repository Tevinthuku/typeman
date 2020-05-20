import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';
import { BrowserRouter as Router } from 'react-router-dom';

import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import Root from './containers/Root';
import useTheme from './hooks/useTheme';

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

function AppComponent() {
  const theme = useTheme();
  return (
    <Router>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <AppContainer>
          <Root />
        </AppContainer>
      </ThemeProvider>
    </Router>
  );
}

document.addEventListener('DOMContentLoaded', () =>
  render(<AppComponent />, document.getElementById('root'))
);
