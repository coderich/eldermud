import React from '@coderich/hotrod/react';
import { Route, Switch } from 'react-router-dom';
import DefaultLayout from './layout/DefaultLayout';
import IndexPage from './page/IndexPage';
import AdminPage from './module/admin/page/IndexPage';

const Routes = () => (
  <DefaultLayout>
    <Switch>
      <Route exact path="/" component={IndexPage} />
      <Route exact path="/admin" component={AdminPage} />
    </Switch>
  </DefaultLayout>
);

export default Routes;
