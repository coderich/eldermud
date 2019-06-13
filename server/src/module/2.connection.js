import { Selector, Reducer } from '@coderich/hotrod';
import { objectGroup } from '@coderich/hotrod/util';

module.exports = (server, store) => {
  // const { actions: serverActions } = store.getModule('server');
  // const { actions: socketActions } = store.getModule('socket');

  // serverActions.connect.subscribe({
  //   success: () => {
  //     socketActions.broadcast.dispatch('Welcome to Eldermud!');
  //   },
  // });

  // const selectors = objectGroup({
  //   get connections() {
  //     return new Selector('connections');
  //   },
  // });

  // const reducers = [
  //   new Reducer(serverActions.connect, selectors.connections, {
  //     success: (app, action) => {
  //       console.log('Socket connected');
  //     },
  //   }),

  //   new Reducer(serverActions.disconnected, selectors.connections, {
  //     success: (app, { payload }) => {
  //       console.log('Socket disconnected');
  //     },
  //   }),
  // ];

  // store.loadModule('connection', { selectors, reducers });
};
