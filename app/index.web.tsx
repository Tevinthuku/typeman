import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';

import theme from './constants/theme';
import App from './containers/App';
import HomePage from './containers/HomePage';
import Landing from './containers/LandingPage';
import routes from './constants/webroutes.json';

function Routes() {
  return (
    <App>
      <Switch>
        <Route exact path={routes.HOME} component={Landing} />
        <Route path={routes.WORKSPACE} component={HomePage} />
      </Switch>
    </App>
  );
}

const root = document.getElementById('root');
render(
  <Router>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes />
    </ThemeProvider>
  </Router>,
  root
);
