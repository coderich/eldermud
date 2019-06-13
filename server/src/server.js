import SocketServer from 'socket.io';
import RequireDir from 'require-dir';
import { createStore, Action, Selector, Reducer } from '@coderich/hotrod';
import { objectGroup } from '@coderich/hotrod/util';

// Server
const server = new SocketServer(3000, { serveClient: false, pingTimeout: 30000 });

// Selectors
const selectors = objectGroup({
  get sockets() {
    return new Selector('server.sockets').default({});
  },
  get socket() {
    return new Selector(this.sockets).map((sockets, id) => sockets[id]).default({});
  },
});

// Actions
const actions = {
  socketConnect: new Action('socket.connect'),
  socketDisconnecting: new Action('socket.disconnecting'),
  socketDisconnected: new Action('socket.disconnected'),
  socketError: new Action('socket.error'),
  socketBroadcast: new Action('socket.broadcast', ({ id, payload }) => { selectors.socket.get(id).broadcast.emit('socket.broadcast', payload); }),
  socketMessage: new Action('socket.message', ({ id, payload }) => { selectors.socket.get(id).emit('socket.message', payload); }),
  serverBroadcast: new Action('server.broadcast', (payload) => { server.emit('server.broadcast', payload); }),
};

// Reducers
const reducers = [
  new Reducer(actions.socketConnect, selectors.sockets, {
    success: (sockets, { payload: { socket } }) => {
      const { id } = socket;
      sockets[id] = socket;
    },
  }),

  new Reducer(actions.socketDisconnected, selectors.sockets, {
    success: (sockets, { payload: { socket } }) => {
      const { id } = socket;
      delete sockets[id];
    },
  }),
];

server.on('connection', (socket) => {
  actions.socketConnect.dispatch({ socket });

  socket.on('disconnecting', (reason) => {
    actions.socketDisconnecting.dispatch({ socket, reason });
  });

  socket.on('disconnect', (reason) => {
    actions.socketDisconnected.dispatch({ socket, reason });
  });

  socket.on('error', (error) => {
    actions.socketError.dispatch({ socket, error });
  });
});

// Store
const store = createStore().loadModule('server', { actions, selectors, reducers });

// Modules
Object.values(RequireDir('./module')).forEach(fn => fn(server, store));
