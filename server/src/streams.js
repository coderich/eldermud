import { Subject } from 'rxjs';
import { filter, concatMap } from 'rxjs/operators';
import { translate } from './service/command.service';
import AbortActionError from './core/AbortActionError';

const timeout = ms => new Promise(res => setTimeout(res, ms));
const balk = (msg) => { throw new AbortActionError(msg); };

const resolveObstacle = (obstacle) => {
  switch (obstacle.type) {
    case 'door': return obstacle.state.open;
    default: return false;
  }
};

export const command$ = new Subject();

export const navigation$ = command$.pipe(
  filter(({ command: { scope } }) => scope === 'navigation'),
  concatMap(async ({ user, command }) => {
    try {
      const room = await user.Room();

      // Check if exit exists
      const exit = await room.Exit(command.code);
      if (!exit) return balk('There is no exit in that direction!');

      // Check for obstacles
      const obstacles = await room.Obstacle(command.code);
      if (obstacles && !obstacles.some(resolveObstacle)) return balk('There is an obstacle in your way!');

      // Proceed
      await timeout(750);
      return { user, from: room, to: exit };
    } catch (e) {
      user.describe('error', e.message);
      return false;
    }
  }),
  filter(v => v),
).subscribe(({ user, from, to }) => {
  user.room = to.id;
  user.describe('room', to);
});

export const interaction$ = command$.pipe(
  filter(({ command: { scope } }) => scope === 'interaction'),
  concatMap(async ({ user, command }) => {
    const room = await user.Room();

    try {
      switch (command.name) {
        case 'open': case 'close': {
          const dir = translate(command.args[0]);
          const door = await room.Door(dir.code);
          const tcc = command.name.charAt(0).toUpperCase() + command.name.slice(1);
          if (!door) throw new AbortActionError('There is nothing in that direction!');
          return { user, info: await door[tcc]() };
        }
        case 'look': {
          return { user, info: room.description };
        }
        case 'get': {
          const target = command.args.join(' ');
          const item = await user.grab(target);
          return { user, info: `You took ${item.name}.` };
        }
        case 'drop': {
          const target = command.args.join(' ');
          const item = await user.drop(target);
          return { user, info: `You dropped ${item.name}.` };
        }
        case 'use': {
          const dir = translate(command.args[command.args.length - 1]);

          if (dir.scope === 'navigation') {
            const door = await room.Door(dir.code);
            if (!door) throw new AbortActionError('There is nothing in that direction!');

            const target = command.args.slice(0, -1).join(' ');
            const item = await user.findItem(target);
            return { user, info: await item.use(door) };
          }

          const target = command.args.join(' ');
          const item = await user.findItem(target);
          return { user, info: await item.use() };
        }
        // case 'push': {
        //   const target = command.args.join(' ');
        //   const item = await user.findItem(target, true);
        //   updateRoom.dispatch({ id: room.id, items: room.items.concat(item.id) });
        //   return user.describe('info', `You dropped ${item.name}.`);
        // }
        // case 'search': {
        //   const items = await room.Items();
        //   const hidden = items.filter(item => item.state.hidden);
        //   return undefined;
        // }
        default:
          throw new AbortActionError('Unable to process command.');
      }
    } catch (e) {
      if (e instanceof AbortActionError) {
        user.describe('error', e.message);
        return false;
      }

      console.error(e);
      return false;
    }
  }),
  filter(v => v),
).subscribe(({ user, info }) => {
  user.describe('info', info);
});


//
command$.pipe(
  filter(({ command: { scope } }) => scope === 'default'),
).subscribe(async ({ user, command }) => {
  const room = await user.Room();
  user.describe('room', room);
});

command$.pipe(
  filter(({ command: { name } }) => name === 'inventory'),
).subscribe(async ({ user, command }) => {
  const items = await user.Items();
  const description = items.length === 0 ? 'nothing!' : items.map(item => item.name).join(', ');
  user.describe('info', `You are carrying: ${description}`);
});

command$.pipe(
  filter(({ command: { name } }) => name === 'unknown'),
).subscribe(async ({ user, command }) => {
  user.describe('info', 'Your command had no effect.');
});
