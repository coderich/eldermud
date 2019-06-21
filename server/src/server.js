import SocketServer from 'socket.io';
import RequireDir from 'require-dir';
import dao from './dao';

// Setup Server
const server = new SocketServer(3003, { serveClient: false, pingTimeout: 30000 });

// Modules
const modules = RequireDir('./module', {
  recurse: true,
  mapValue: (value, baseName) => {
    const [fn = value] = Object.values(value);
    return fn;
  },
});

Object.values(modules).forEach(fn => fn(server, dao));

export default server;
