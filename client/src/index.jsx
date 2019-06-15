import 'file-loader?name=[name].[ext]!./index.html'; // eslint-disable-line
import React, { Provider } from '@coderich/hotrod/react';
import { Services, Action } from '@coderich/hotrod';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import SocketIO from 'socket.io-client';
import Routes from './Routes';
import store from './store';

const { $history } = Services.get();

const server = SocketIO('http://localhost:3003');

server.on('message', (data) => {
  console.log(data);
});

// Load modules
store.loadModule('app', {
  actions: {
    command: new Action('command', (payload, { $http }) => {
      server.send(payload);
    }),
  },
});

ReactDOM.render(
  <CssBaseline>
    <Provider store={store}>
      <Router history={$history}>
        <Routes />
      </Router>
    </Provider>
  </CssBaseline>,
  global.document.getElementById('root'),
);
