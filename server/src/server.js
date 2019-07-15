import SocketServer from 'socket.io';
import Chance from 'chance';
import { setData, pushData } from './service/DataService';
import { translate } from './service/CommandService';
import { setSocket, unsetSocket } from './service/SocketService';
import { writeStream, closeStream } from './service/StreamService';
import * as actions from './actions';

// Setup Server
const server = new SocketServer(3003, { serveClient: false, pingTimeout: 30000 });

const chance = new Chance();

const newUser = id => ({
  id: `user.${id}`,
  name: chance.name(),
  hp: 25,
  mhp: 30,
  ac: 10,
  attacks: {
    'attack.punch': {
      lead: 1000,
      lag: 2000,
      dmg: '4d10',
      acc: '5d10',
    },
  },
  isLoggedIn: true,
  room: 'room.1',
  items: [],
});

server.on('connection', async (socket) => {
  const { id } = socket;
  const user = await setData(`user.${id}`, newUser(id));
  await pushData('room.1', 'units', user.id);
  setSocket(user.id, socket);
  writeStream(user.id, actions.scan(user.id));

  socket.on('disconnecting', async (reason) => {
    unsetSocket(user.id);
    closeStream(user.id);
  });

  socket.on('disconnect', (reason) => {
    socket.removeAllListeners();
  });

  socket.on('error', (error) => {
  });

  socket.on('message', async (input) => {
    const command = translate(input);

    if (command.scope === 'navigation') {
      return writeStream(`${user.id}`, actions.move(user.id, command.code));
    }

    switch (command.name) {
      case 'look': {
        const target = command.args.join(' ');
        return writeStream(`${user.id}`, actions.look(user.id, target));
      }
      case 'get': {
        const target = command.args.join(' ');
        return writeStream(`${user.id}`, actions.get(user.id, target));
      }
      case 'drop': {
        const target = command.args.join(' ');
        return writeStream(`${user.id}`, actions.drop(user.id, target));
      }
      case 'inventory': {
        return writeStream(`${user.id}`, actions.inventory(user.id));
      }
      default: {
        return writeStream(`${user.id}`, actions.scan(user.id));
      }
    }
  });
});

export default server;
