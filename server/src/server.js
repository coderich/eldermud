import SocketServer from 'socket.io';
import Chance from 'chance';
import { getData, setData, pushData } from './service/data.service';
import { translate } from './service/command.service';
import { setSocket } from './service/socket.service';
import { writeStream } from './service/stream.service';
import * as actions from './game/actions';
import * as talents from './game/talents';

// Setup Server
const server = new SocketServer(3003, { serveClient: false, pingTimeout: 30000 });

const chance = new Chance();

const newUser = id => ({
  id,
  name: chance.name(),
  hp: 30,
  mhp: 30,
  ac: 10,
  exp: 10000,
  talents: ['rage', 'mihe', 'vamp', 'dble', 'hail'],
  isLoggedIn: true,
  room: 'room.1',
  items: [],
  combatants: [],
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

    switch (command.scope) {
      case 'navigation': {
        return writeStream(userId, await actions.move(userId, command.code, command.name));
      }
      case 'talent': {
        const unit = await getData(userId);
        if (unit.talents.indexOf(command.code) === -1) return unit.emit('message', { type: 'info', value: 'Your command had no effect.' });
        return writeStream(userId, await talents[command.code](userId, command));
      }
      case 'channel': {
        console.log('switch to channel', command.code);
        return null;
      }
      default: {
        switch (command.name) {
          case 'attack': {
            const attack = { dmg: '2d5+3', acc: '3d5+5', hits: ['hit'], misses: ['swing'] };
            const target = command.args.join(' ');
            return writeStream(userId, await actions.attack(userId, target, attack));
          }
          case 'break': {
            return writeStream(userId, await actions.break(userId));
          }
          case 'buy': {
            const target = command.args.join(' ');
            return writeStream(userId, await actions.buy(userId, target));
          }
          case 'open': case 'close': {
            const target = command.args.join(' ');
            return writeStream(userId, await actions[command.name](userId, target));
          }
          case 'drop': {
            const target = command.args.join(' ');
            return writeStream(userId, await actions.drop(userId, target));
          }
          case 'equip': {
            const target = command.args.join(' ');
            return writeStream(userId, await actions.equip(userId, target));
          }
          case 'exp': {
            return writeStream(userId, await actions.exp(userId));
          }
          case 'get': {
            const target = command.args.join(' ');
            return writeStream(userId, await actions.get(userId, target));
          }
          case 'inventory': {
            return writeStream(userId, await actions.inventory(userId));
          }
          case 'list': {
            return writeStream(userId, await actions.list(userId));
          }
          case 'lock': {
            const target = command.args.join(' ');
            return writeStream(userId, await actions.lock(userId, target));
          }
          case 'look': {
            const target = command.args.join(' ');
            return writeStream(userId, await actions.look(userId, target));
          }
          case 'search': {
            return writeStream(userId, await actions.search(userId));
          }
          case 'sell': {
            const target = command.args.join(' ');
            return writeStream(userId, await actions.sell(userId, target));
          }
          case 'unlock': {
            const target = command.args.join(' ');
            return writeStream(userId, await actions.unlock(userId, target));
          }
          case 'use': {
            const dir = translate(command.args[command.args.length - 1]);
            return writeStream(userId, await actions.use(userId, command, dir));
          }
          case 'none': {
            return writeStream(userId, await actions.scan(userId));
          }
          default: {
            return writeStream(userId, await actions.say(userId, command.input));
          }
          // default: {
          //   return socket.emit('message', { type: 'info', value: 'Your command had no effect.' });
          // }
        }
      }
    }
  });
});

export default server;
