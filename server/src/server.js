import SocketServer from 'socket.io';
import * as store from './store';

// Setup Server
const server = new SocketServer(3003, { serveClient: false, pingTimeout: 30000 });

server.on('connection', async (socket) => {
  const { id } = socket;
  const data = { id: `user.${id}`, isLoggedIn: true, room: 'room.1', items: [], socket, subscriptions: [] }; // Faking a user
  const user = await store.get(`user.${id}`, data);

  (async () => {
    const room = await user.Room();
    room.join(user.id);
    socket.join(`room-${room.id}`);
    socket.emit('message', await user.describe('room', room));

    user.stream$.subscribe({
      next: msg => socket.emit('message', msg),
    });
  })();

  socket.on('disconnecting', async (reason) => {
    const room = await user.Room();
    room.leave(user.id);
    socket.leave(`room-${room.id}`);
    store.del('user', user.id);
  });

  socket.on('disconnect', (reason) => {
    socket.removeAllListeners();
  });

  socket.on('error', (error) => {
  });

  socket.on('message', async (input) => {
    user.process(input);
  });
});

export default server;
