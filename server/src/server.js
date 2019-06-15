import SocketServer from 'socket.io';
import RequireDir from 'require-dir';
import store from './store';

// Server
const server = new SocketServer(3003, { serveClient: false, pingTimeout: 30000 });

// Modules
Object.values(RequireDir('./module')).forEach(fn => fn(server, store));

export default server;
