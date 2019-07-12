import SocketServer from 'socket.io';
import * as store from './store';

// Setup Server
const server = new SocketServer(3003, { serveClient: false, pingTimeout: 30000 });

server.on('connection', async (socket) => {
  const { id } = socket;
  const data = { id, isLoggedIn: true, items: [], room: 11, socket, subscriptions: [] };
  const user = await store.get('user', id, data);

  (async () => {
    const room = await user.Room();
    room.join(user);
    socket.join(`room-${room.id}`);
    socket.emit('message', await user.describe('room', room));

    user.stream$.subscribe({
      next: msg => socket.emit('message', msg),
    });
  })();

  socket.on('disconnecting', async (reason) => {
    const room = await user.Room();
    room.leave(user);
    socket.leave(`room-${room.id}`);
    store.del('user', user.id);
  });

  socket.on('disconnect', (reason) => {
    socket.removeAllListeners();
  });

  socket.on('error', (error) => {
  });

  socket.on('message', async (input) => {
    user.stream$.next(input.trim());
  });
});

export default server;
