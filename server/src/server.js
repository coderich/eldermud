import SocketServer from 'socket.io';
import Chance from 'chance';
import { getData, setData, pushData, pullData } from './service/data.service';
import { translate } from './service/command.service';
import { setSocket, unsetSocket } from './service/socket.service';
import { writeStream, closeStream } from './service/stream.service';
import * as actions from './actions';

// Setup Server
const server = new SocketServer(3003, { serveClient: false, pingTimeout: 30000 });

const chance = new Chance();

const newUser = id => ({
  id,
  name: chance.name(),
  hp: 30,
  mhp: 30,
  ac: 12,
  exp: 0,
  attacks: {
    'attack.punch': {
      dmg: '5d10',
      acc: '5d10',
    },
  },
  isLoggedIn: true,
  room: 'room.1',
  items: [],
});

server.on('connection', async (socket) => {
  const { id } = socket;
  const userId = `user.${id}`;
  setSocket(userId, socket);
  const user = await setData(userId, newUser(userId));
  await pushData('room.1', 'units', userId);
  writeStream(userId, await actions.scan(userId));
  user.minimap();
  user.status();
  user.connect();

  socket.on('disconnecting', async (reason) => {
    user.disconnect();
  });

  socket.on('disconnect', (reason) => {
    socket.removeAllListeners();
  });

  socket.on('error', (error) => {
  });

  socket.on('message', async (input) => {
    const command = translate(input);

    if (command.scope === 'navigation') {
      return writeStream(userId, await actions.move(userId, command.code, command.name));
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
      case 'exp': {
        return writeStream(userId, await actions.exp(userId));
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
      case 'break': {
        return writeStream(userId, await actions.break(userId));
      }
      case 'none': {
        return writeStream(userId, await actions.scan(userId));
      }
      default: {
        return socket.emit('message', { type: 'info', value: 'Your command had no effect.' });
      }
    }
  });
});

export default server;
