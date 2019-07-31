import React from '@coderich/hotrod/react';
import { Route, Switch } from 'react-router-dom';
import DefaultLayout from './layout/DefaultLayout';
import IndexPage2 from './page/IndexPage2';

const Routes = () => (
  <DefaultLayout>
    <Switch>
      <Route exact path="/" component={IndexPage2} />
    </Switch>
  </DefaultLayout>
);

export default Routes;
