import SocketServer from 'socket.io';
import Chance from 'chance';
import { getData, setData, pushData, pullData } from './service/data.service';
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
  combat: {
    engaged: false,
  },
});

server.on('connection', async (socket) => {
  const { id } = socket;
  const { id: userId } = await setData(`user.${id}`, newUser(id));
  await pushData('room.1', 'units', userId);
  setSocket(userId, socket);
  writeStream(userId, await actions.scan(userId));

  socket.on('disconnecting', async (reason) => {
    unsetSocket(userId);
    closeStream(userId);
    const room = await getData(userId, 'room');
    pullData(room, 'units', userId);
  });

  socket.on('disconnect', (reason) => {
    socket.removeAllListeners();
  });

  socket.on('error', (error) => {
  });

  socket.on('message', async (input) => {
    const command = translate(input);

    if (command.scope === 'navigation') {
      return writeStream(userId, await actions.move(userId, command.code));
    }

    switch (command.name) {
      case 'attack': {
        const target = command.args.join(' ');
        return writeStream(userId, await actions.attack(userId, target));
      }
      case 'look': {
        const target = command.args.join(' ');
        return writeStream(userId, await actions.look(userId, target));
      }
      case 'get': {
        const target = command.args.join(' ');
        return writeStream(userId, await actions.get(userId, target));
      }
      case 'drop': {
        const target = command.args.join(' ');
        return writeStream(userId, await actions.drop(userId, target));
      }
      case 'open': case 'close': {
        const target = command.args.join(' ');
        return writeStream(userId, await actions[command.name](userId, target));
      }
      case 'inventory': {
        return writeStream(userId, await actions.inventory(userId));
      }
      case 'search': {
        return writeStream(userId, await actions.search(userId));
      }
      case 'use': {
        const dir = translate(command.args[command.args.length - 1]);
        return writeStream(userId, await actions.use(userId, command, dir));
      }
      default: {
        return writeStream(userId, await actions.scan(userId));
      }
    }
  });
});

export default server;
