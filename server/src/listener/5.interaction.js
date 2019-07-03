import AbortActionError from '../core/AbortActionError';
import { intercept, translate } from '../service/command.service';

module.exports = (server, dao) => {
  const { actions: { addCommand, updateRoom, updateUser } } = dao.store.info();

  intercept(addCommand, 'interaction', async ({ user, command }) => {
    const room = await user.Room();

    switch (command.name) {
      case 'open': case 'close': {
        const dir = translate(command.args[0]);
        const door = await room.Door(dir.code);
        const tcc = command.name.charAt(0).toUpperCase() + command.name.slice(1);
        if (!door) throw new AbortActionError('There is nothing in that direction!');
        return user.describe('info', await door[tcc]());
      }
      case 'look': {
        return user.describe('info', room.description);
      }
      case 'get': {
        const target = command.args.join(' ');
        const item = await room.findItem(target, true);
        updateUser.dispatch({ id: user.id, items: user.items.concat(item.id) });
        return user.describe('info', `You took ${item.name}.`);
      }
      case 'drop': {
        const target = command.args.join(' ');
        const item = await user.findItem(target, true);
        updateRoom.dispatch({ id: room.id, items: room.items.concat(item.id) });
        return user.describe('info', `You dropped ${item.name}.`);
      }
      case 'use': {
        const dir = translate(command.args[command.args.length - 1]);

        if (dir.scope === 'navigation') {
          const door = await room.Door(dir.code);
          if (!door) throw new AbortActionError('There is nothing in that direction!');

          const target = command.args.slice(0, -1).join(' ');
          const item = await user.findItem(target);
          return user.describe('info', await item.use(door));
        }

        const target = command.args.join(' ');
        const item = await user.findItem(target);
        return user.describe('info', await item.use());
      }
      // case 'push': {
      //   const target = command.args.join(' ');
      //   const item = await user.findItem(target, true);
      //   updateRoom.dispatch({ id: room.id, items: room.items.concat(item.id) });
      //   return user.describe('info', `You dropped ${item.name}.`);
      // }
      case 'search': {
        const items = await room.Items();
        const hidden = items.filter(item => item.state.hidden);
      }
      default:
        throw new AbortActionError('Unable to process command.');
    }
  });
};
