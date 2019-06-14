import 'file-loader?name=[name].[ext]!./index.html'; // eslint-disable-line
import React, { Provider } from '@coderich/hotrod/react';
import { Services } from '@coderich/hotrod';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import SocketIO from 'socket.io-client';
import Routes from './Routes';
import store from './store';

const { $history } = Services.get();

const server = SocketIO('http://localhost:3000');

server.send('hello');

server.on('message', (data) => {
  console.log(data);
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
