import SocketServer from 'socket.io';
import * as store from './store';

// Setup Server
const server = new SocketServer(3003, { serveClient: false, pingTimeout: 30000 });

server.on('connection', async (socket) => {
  const { id } = socket;
  const data = { id, socket, isLoggedIn: true, items: [], room: 11, subscriptions: [] };
  const user = await store.get('user', id, data);
  const room = await user.Room();
  room.addPlayer(id);
  socket.emit('message', await user.describe('room', room));

  user.stream$.subscribe({
    next: msg => socket.emit('message', msg),
  });

  socket.on('disconnecting', async (reason) => {
    store.del('user', user.id);
  });

  socket.on('disconnect', (reason) => {
    socket.removeAllListeners();
  });

  socket.on('error', (error) => {
  });

  socket.on('message', async (input) => {
    user.stream$.next(input);
  });
});

export default server;
