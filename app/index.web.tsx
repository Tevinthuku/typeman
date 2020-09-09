import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';

import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';

import LoadingWorkSpace from './components/LoadingWorkspace';

import AppLayout from './components/Layout';
import routes from './constants/webroutes.json';
import useTheme from './hooks/useTheme';

import Landing from './containers/LandingPage';
import { registerSW } from './sw';

const Workspace = lazy(() => import('./containers/Workspace'));

registerSW();
function Routes() {
  return (
    <AppLayout>
      <Switch>
        <Route exact path={routes.HOME} component={Landing} />
        <Suspense fallback={<LoadingWorkSpace />}>
          <Route path={routes.WORKSPACE} component={Workspace} />
        </Suspense>
      </Switch>
    </AppLayout>
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
