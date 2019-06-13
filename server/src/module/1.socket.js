import { Action, Selector, Reducer } from '@coderich/hotrod';
import { objectGroup } from '@coderich/hotrod/util';

class Socket {
  constructor(server, store) {
    this.server = server;
    this.store = store;
    this.mount();
  }

  mount() {
    const { actions: serverActions } = this.store.getModule('server');
    const { actions: socketActions } = this.store.getModule('socket');

    const actions = {
      broadcast: new Action('socket.broadcast', (payload) => {
        this.server.emit('socket.broadcast', `${payload}-hello-bally`);
      }),
    };

    const selectors = objectGroup({
      get sockets() {
        return new Selector('sockets').default({});
      },
    });

    const reducers = [
      new Reducer(serverActions.connect, selectors.sockets, {
        success: (sockets, { payload: { socket } }) => {
          const { id } = socket;
          sockets[id] = socket;
        },
      }),

      new Reducer(serverActions.disconnected, selectors.sockets, {
        success: (sockets, { payload: { socket } }) => {
          const { id } = socket;
          delete sockets[id];
        },
      }),
    ];

    this.store.loadModule('socket', { actions, selectors, reducers });
  }

  unmount() {
    console.log('unmounting');
    this.store.unloadModule('socket');
  }
}

module.exports = Socket;
