import SocketServer from 'socket.io';
import Chance from 'chance';
import { getData, getList, setData, pushData } from './service/data.service';
import { translate } from './service/command.service';
import { setSocket } from './service/socket.service';
import { writeStream } from './service/stream.service';
import { svl } from './service/util.service';
import * as actions from './game/actions';
import * as talents from './game/talents';

// Setup Server
const server = new SocketServer(3003, { serveClient: false, pingTimeout: 30000 });

const chance = new Chance();

const newUser = (id, { str, agi, int, tals = [] }) => ({
  id,
  lvl: 1,
  str,
  agi,
  int,
  hp: svl(str),
  ma: svl(int),
  ac: 10,
  exp: 0,
  name: chance.name(),
  isLoggedIn: true,
  room: 'room.1',
  items: [],
  equipped: [],
  talents: tals,
  cooldowns: {},
});

server.on('connection', async (socket) => {
  let user;
  const { id, handshake: { query } } = socket;
  const userId = query.uid || `user.${id}`;
  setSocket(userId, socket);

  if (query.uid) {
    user = await getData(userId);
  } else {
    const { hero } = query;

    switch (hero) {
      case 'warrior': {
        user = await setData(userId, newUser(userId, { str: 5, agi: 2, int: 1 }));
        break;
      }
      case 'thief': {
        user = await setData(userId, newUser(userId, { str: 2, agi: 5, int: 1 }));
        break;
      }
      case 'wizard': {
        user = await setData(userId, newUser(userId, { str: 2, agi: 1, int: 5 }));
        break;
      }
      default: {
        user = await setData(userId, newUser(userId, { str: 1, agi: 1, int: 1 }));
        break;
      }
    }
  }

  await pushData(user.room, 'units', userId);
  writeStream(userId, await actions.scan(userId));
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
        return writeStream(userId, await talents[command.name](userId, command));
      }
      case 'channel': {
        console.log('switch to channel', command.code);
        return null;
      }
      default: {
        switch (command.name) {
          case 'attack': {
            const equipped = await getList(userId, 'equipped');
            const weapon = equipped.find(eq => eq.type === 'weapon');
            const attack = weapon ? weapon.attack : { dmg: '1d3', acc: '3d5+5', hits: ['punch'], misses: ['swing'] };
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
          case 'learn': {
            const target = command.args.join(' ');
            return writeStream(userId, await actions.learn(userId, target));
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
          case 'remove': {
            const target = command.args.join(' ');
            return writeStream(userId, await actions.remove(userId, target));
          }
          case 'search': {
            return writeStream(userId, await actions.search(userId));
          }
          case 'sell': {
            const target = command.args.join(' ');
            return writeStream(userId, await actions.sell(userId, target));
          }
          case 'train': {
            const target = command.args.join(' ');
            return writeStream(userId, await actions.train(userId, target));
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
