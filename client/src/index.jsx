import 'file-loader?name=[name].[ext]!./index.html'; // eslint-disable-line
import 'jsplumb/css/jsplumbtoolkit-defaults.css';
import { Services, Action, Selector, Reducer } from '@coderich/hotrod';
import React, { Provider } from '@coderich/hotrod/react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import SocketIO from 'socket.io-client';
import Routes from './Routes';
import store from './store';

const { $history, $storage } = Services.get();
let query = Object.entries($storage.get('query') || {}).map(([key, value]) => `${key}=${value}`).join('&');
if ($history.location.search) query = `${$history.location.search.substr(1)}&${query}`;
const server = SocketIO('http://localhost:3003', { query });

const actions = {
  command: new Action('command', (payload, { $http }) => { server.send(payload); }),
  response: new Action('response'),
  prompt: new Action('prompt'),
  room: new Action('room'),
  stats: new Action('stats'),
  status: new Action('status'),
  minimap: new Action('minimap'),
};

const selectors = {
  data: new Selector('data').default({}),
  prompt: new Selector('data.prompt').default('>'),
  room: new Selector('data.room').default({}),
  stats: new Selector('data.stats').default({}),
  status: new Selector('data.status').default({}),
  responses: new Selector('data.responses').default([]),
  maps: new Selector('data.maps').default({ minimap: [] }),
};

const reducers = [
  new Reducer(actions.prompt, selectors.prompt, ({
    success: (prompt, { payload }) => {
      return payload;
    },
  })),
  new Reducer(actions.room, selectors.data, ({
    success: (data, { payload }) => {
      data.room = payload;
    },
  })),
  new Reducer(actions.stats, selectors.data, ({
    success: (data, { payload }) => {
      data.stats = payload;
    },
  })),
  new Reducer(actions.status, selectors.data, ({
    success: (data, { payload }) => {
      data.status = payload;
    },
  })),
  new Reducer(actions.response, selectors.data, ({
    success: (data, { payload }) => {
      data.responses = data.responses.slice(-39).concat(payload);
    },
  })),
  new Reducer(actions.minimap, selectors.maps, ({
    success: (maps, { payload }) => {
      maps.minimap = payload;
    },
  })),
];

server.on('message', (data) => {
  switch (data.type) {
    case 'stats': {
      return actions.stats.dispatch(data.value);
    }
    case 'status': {
      const q = $storage.get('query') || {};
      q.uid = data.value.id;
      $storage.set('query', q);
      actions.prompt.dispatch(`[HP=${data.value.hp},MA=${data.value.ma}]:`);
      return actions.status.dispatch(data.value);
    }
    case 'minimap': {
      return actions.minimap.dispatch(data.value);
    }
    case 'room': {
      actions.room.dispatch(data.value);
      actions.response.dispatch(data);
      break;
    }
    default: {
      return actions.response.dispatch(data);
    }
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
