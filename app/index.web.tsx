import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';

import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';

import LoadingWorkSpace from './components/LoadingWorkspace';

import App from './containers/App';
import Landing from './containers/LandingPage';
import routes from './constants/webroutes.json';
import useTheme from './hooks/useTheme';

const Workspace = lazy(() => import('./containers/HomePage'));

function Routes() {
  return (
    <App>
      <Switch>
        <Route exact path={routes.HOME} component={Landing} />
        <Suspense fallback={<LoadingWorkSpace />}>
          <Route path={routes.WORKSPACE} component={Workspace} />
        </Suspense>
      </Switch>
    </App>
  );
}

function AppContainer() {
  const theme = useTheme();

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes />
      </ThemeProvider>
    </Router>
  );
}

const root = document.getElementById('root');
render(<AppContainer />, root);
