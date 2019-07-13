import 'file-loader?name=[name].[ext]!./index.html'; // eslint-disable-line
import 'jsplumb/css/jsplumbtoolkit-defaults.css';
import React, { Provider } from '@coderich/hotrod/react';
import { Services, Action, Selector, Reducer } from '@coderich/hotrod';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import SocketIO from 'socket.io-client';
import Routes from './Routes';
import store from './store';

const { $history } = Services.get();

const server = SocketIO('http://localhost:3003');

const actions = {
  command: new Action('command', (payload, { $http }) => {
    server.send(payload);
  }),
  response: new Action('response'),
  prompt: new Action('prompt'),
};

const selectors = {
  prompt: new Selector('data.prompt').default('>'),
  responses: new Selector('data.responses').default([]),
};

const reducers = [
  new Reducer(actions.prompt, selectors.prompt, ({
    success: (prompt, { payload }) => {
      return payload;
    },
  })),
  new Reducer(actions.command, selectors.responses, ({
    success: (responses, { payload }) => {
      responses.push({ type: 'command', value: payload });
    },
  })),
  new Reducer(actions.response, selectors.responses, ({
    success: (responses, { payload }) => {
      responses.push(payload);
    },
  })),
];

server.on('message', (data) => {
  // console.log(data);
  if (data.type === 'status') {
    actions.prompt.dispatch(`[HP=${data.value.hp}]:`);
  } else {
    actions.response.dispatch(data);
  }
});

// Load modules
store.loadModule('app', { actions, selectors, reducers });

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
