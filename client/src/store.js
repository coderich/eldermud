import { Config, Services, createStore } from '@coderich/hotrod';
import { createMuiTheme } from '@material-ui/core/styles';
// import appModule from './module/app';

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
).withTheme(createMuiTheme({
  typography: {
    useNextVariants: true,
  },
}));

export default store;
