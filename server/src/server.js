import SocketServer from 'socket.io';
import RequireDir from 'require-dir';
import dao from './dao';

const mapValue = (value, baseName) => {
  const [fn = value] = Object.values(value);
  return fn;
};

// Setup Server
const server = new SocketServer(3003, { serveClient: false, pingTimeout: 30000 });

// Modules
Object.entries(RequireDir('./module', { recurse: true, mapValue })).forEach(([name, fn]) => {
  const mod = fn(dao.addStoreModel(name));
  dao.store.loadModule(name, mod);
});

// Listeners
Object.values(RequireDir('./listener')).forEach(fn => fn(server, dao));

export default server;
