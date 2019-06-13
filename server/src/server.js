import Chokidar from 'chokidar';
import SocketServer from 'socket.io';
import ImportFresh from 'import-fresh';
import { createStore, Action } from '@coderich/hotrod';

// Actions
const actions = {
  connect: new Action('server.connect'),
  disconnecting: new Action('server.disconnecting'),
  disconnected: new Action('server.disconnected'),
  error: new Action('server.error'),
};

// Server
const server = new SocketServer(3000, { serveClient: false });

server.on('connection', (socket) => {
  actions.connect.dispatch({ socket });

  socket.on('disconnecting', (reason) => {
    actions.disconnecting.dispatch({ socket, reason });
  });

  socket.on('disconnect', (reason) => {
    actions.disconnected.dispatch({ socket, reason });
  });

  socket.on('error', (error) => {
    actions.error.dispatch({ socket, error });
  });
});

// Store
const store = createStore().loadModule('server', { actions });

try {
  // Modules
  const modules = {};

  const loadModule = (path) => {
    if (modules[path]) modules[path].unmount();
    modules[path] = new (ImportFresh(path))(server, store);
  };

  const watcher = Chokidar.watch('./module', { ignored: /(^|[/\\])\../, persistent: true, cwd: __dirname, awaitWriteFinish: true });
  watcher.on('add', path => loadModule(`./${path}`));
  watcher.on('change', path => loadModule(`./${path}`));
  watcher.on('unlink', path => unloadModule(`./${path}`));
} catch (e) {
  console.log(e);
}
