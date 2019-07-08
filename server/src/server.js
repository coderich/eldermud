import SocketServer from 'socket.io';
import { translate } from './service/command.service';
import * as store from './store';

// Setup Server
const server = new SocketServer(3003, { serveClient: false, pingTimeout: 30000 });

server.on('connection', async (socket) => {
  const user = await store.get('user', 1, { socket, isLoggedIn: true, subscriptions: [] });
  const room = await user.Room();
  const value = await user.describe('room', room);
  socket.emit('message', value);

  user.stream$.subscribe({
    next: msg => socket.emit('message', msg),
  });

  // user.stream$.subscribe({
  //   next: async (msg) => {
  //     if (msg instanceof AbortActionError) return socket.emit('message', { type: 'error', value: msg.message });
  //     if (msg instanceof Room) return socket.emit('message', { type: 'room', value: (await user.describe('room', msg)) });
  //     return socket.emit('message', { type: 'info', value: msg });
  //   },
  // });

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
    user.stream$.next(command);
    // command$.next({ user, command });
  });
});

export default server;
