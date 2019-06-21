import SocketServer from 'socket.io';
import RequireDir from 'require-dir';
import dao from './dao';

// Setup Server
const server = new SocketServer(3003, { serveClient: false, pingTimeout: 30000 });

// Modules
Object.values(RequireDir('./module')).forEach(fn => fn(server, dao));

export default server;
