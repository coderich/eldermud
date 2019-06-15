import { Action, Reducer } from '@coderich/hotrod';

module.exports = (server, store) => {
  const { selectors } = store.info();

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

  store.loadModule('setup', { actions, reducers });

  server.on('connection', (socket) => {
    actions.connect.dispatch({ id: socket.id });
    actions.login.dispatch({ id: socket.id, user: { id: 1, room: 1, isLoggedIn: true } });

    socket.on('disconnecting', (reason) => {
      actions.logout.dispatch({ id: socket.id });
      actions.disconnect.dispatch({ id: socket.id, reason });
    });

    socket.on('disconnect', (reason) => {
    });

    socket.on('error', (error) => {});
  });
};
