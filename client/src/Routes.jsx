import React from '@coderich/hotrod/react';
import { Route, Switch } from 'react-router-dom';
import DefaultLayout from './layout/DefaultLayout';
import IndexPage from './page/IndexPage';

const Routes = () => (
  <DefaultLayout>
    <Switch>
      <Route exact path="/" component={IndexPage} />
    </Switch>
  </DefaultLayout>
);

export default Routes;
