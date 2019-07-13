import SocketServer from 'socket.io';
import Chance from 'chance';
import * as store from './store';

// Setup Server
const server = new SocketServer(3003, { serveClient: false, pingTimeout: 30000 });

const chance = new Chance();

server.on('connection', async (socket) => {
  const { id } = socket;
  const data = {
    id: `user.${id}`,
    name: chance.name(),
    hp: 27,
    ac: 10,
    attacks: {
      'attack.punch': {
        lead: 1000,
        lag: 2000,
        dmg: '1d4',
        acc: '1d20',
      },
    },
    isLoggedIn: true,
    room: 'room.1',
    socket,
    subscriptions: [],
  }; // Faking a user
  const user = await store.get(`user.${id}`, data);

  (async () => {
    const room = await user.Room();
    room.join(user.id);
    socket.join(`room-${room.id}`);
    socket.emit('message', { type: 'status', value: { hp: user.hp } });
    socket.emit('message', await user.describe('room', room));

    user.stream$.subscribe({
      next: (msg) => {
        if (msg.type) socket.emit('message', msg);
      },
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
