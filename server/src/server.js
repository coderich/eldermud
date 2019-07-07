import SocketServer from 'socket.io';
import { translate } from './service/command.service';
import { command$ } from './streams';
import * as store from './store';

// Setup Server
const server = new SocketServer(3003, { serveClient: false, pingTimeout: 30000 });

server.on('connection', async (socket) => {
  const user = await store.get('user', 1, { socket, isLoggedIn: true, subscriptions: [] });
  user.describe('room', await user.Room());

  socket.on('disconnecting', async (reason) => {
    store.del('user', user.id);
  });

  socket.on('disconnect', (reason) => {
    socket.removeAllListeners();
  });

  socket.on('error', (error) => {
  });

  socket.on('message', async (input) => {
    const command = translate(input);
    command$.next({ user, command });
  });
});

export default server;
