import SocketServer from 'socket.io';
import RequireDir from 'require-dir';
import { createStore, Action, Selector, Reducer } from '@coderich/hotrod';
import { objectGroup } from '@coderich/hotrod/util';

// Server
const server = new SocketServer(3000, { serveClient: false, pingTimeout: 30000 });

// Selectors
const selectors = objectGroup({
  get socket() { return new Selector(this.sockets).map((sockets, i) => sockets[i]); },
  get sockets() { return new Selector('sockets').map(a => server.sockets.connected).default({}); },

  get client() { return new Selector(this.clients).map((clients, i) => clients[i]); },
  get clients() { return new Selector('clients').default({}); },

  get user() { return new Selector(this.users).map((users, i) => users[i]); },
  get users() {
    return new Selector(this.clients).map((clients) => {
      return Object.values(clients).map(client => client.user).reduce((prev, user) => {
        return Object.assign(prev, { [user.id]: user });
      }, {});
    }).default({});
  },
});

// Actions
const actions = {
  connect: new Action('connect'),
  disconnect: new Action('disconnect'),
  login: new Action('login'),
  logout: new Action('logout'),
};

// Reducers
const reducers = [
  new Reducer(actions.connect, selectors.clients, {
    success: (clients, { payload }) => {
      const { id } = payload;
      clients[id] = payload;
    },
  }),

  new Reducer(actions.disconnect, selectors.clients, {
    success: (clients, { payload }) => {
      const { id } = payload;
      delete clients[id];
    },
  }),

  new Reducer(actions.login, selectors.clients, {
    success: (clients, { payload }) => {
      const { id, user } = payload;
      clients[id].user = user;
    },
  }),

  new Reducer(actions.logout, selectors.clients, {
    success: (clients, { payload }) => {
      const { id } = payload;
      delete clients[id].user;
    },
  }),
];

server.on('connection', (socket) => {
  actions.connect.dispatch({ id: socket.id });
  actions.login.dispatch({ id: socket.id, user: { id: 1, room:1, isLoggedIn: true } });

  socket.on('disconnecting', (reason) => {
    actions.logout.dispatch({ id: socket.id });
    actions.disconnect.dispatch({ id: socket.id, reason });
  });

  socket.on('disconnect', (reason) => {
  });

  socket.on('error', (error) => {});
});

// Store
const store = createStore().loadModule('server', { actions, selectors, reducers });

// Modules
Object.values(RequireDir('./module')).forEach(fn => fn(server, store));
