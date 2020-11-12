import React from '@coderich/hotrod/react';
import { Route, Switch } from 'react-router-dom';
import DefaultLayout from './layout/DefaultLayout';
import GameIndex from './module/game/page/IndexPage';
import AdminIndex from './module/admin/page/IndexPage';

const Routes = () => (
  <DefaultLayout>
    <Switch>
      <Route exact path="/" component={GameIndex} />
      <Route exact path="/admin" component={AdminIndex} />
    </Switch>
  </DefaultLayout>
);

export default Routes;
