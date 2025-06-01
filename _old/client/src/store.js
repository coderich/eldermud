import { Config, Services, createStore } from '@coderich/hotrod';
import theme from './theme';

// Configure first
Config.set('lib.history.type', 'browser');
Config.set('lib.storage.type', 'browser');

// Now you can get services
const { $storage: localStorage } = Services.get();
const app = localStorage.get('app') || {};

// Create our store with initial state (default reducer)
const store = createStore(
  undefined,
  { app, data: { responses: [] } },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(), // eslint-disable-line
).withTheme(theme);

export default store;
