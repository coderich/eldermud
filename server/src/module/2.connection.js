import { Selector, Reducer } from '@coderich/hotrod';
import { objectGroup } from '@coderich/hotrod/util';

module.exports = class {
  constructor(server, store) {
    this.server = server;
    this.store = store;
    this.subscriptions = [];
    this.mount();
  }

  mount() {
    const { actions: serverActions } = this.store.getModule('server');
    const { actions: socketActions } = this.store.getModule('socket');

    this.subscriptions.push(serverActions.connect.subscribe({
      success: () => {
        socketActions.broadcast.dispatch('Welcome to Eldermud man!');
      },
    }));

    const selectors = objectGroup({
      get connections() {
        return new Selector('connections');
      },
    });

    const reducers = [
      new Reducer(serverActions.connect, selectors.connections, {
        success: (app, action) => {
          console.log('Socket connected');
        },
      }),

      new Reducer(serverActions.disconnected, selectors.connections, {
        success: (app, { payload }) => {
          console.log('Socket disconnected');
        },
      }),
    ];

    this.store.loadModule('connection', { selectors, reducers });
  }

  unmount() {
    this.store.unloadModule('connection');
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
};
