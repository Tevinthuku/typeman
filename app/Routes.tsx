import React from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from './constants/routes.json';
import AppLayout from './components/Layout';
import HomePage from './containers/Workspace';

export default function Routes() {
  return (
    <AppLayout>
      <Switch>
        <Route path={routes.HOME} component={HomePage} />
      </Switch>
    </AppLayout>
  );
}
