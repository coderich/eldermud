import AbortActionError from '../core/AbortActionError';
import { intercept, translate } from '../service/command.service';

module.exports = (server, dao) => {
  const { actions: { addCommand, updateRoom, updateUser } } = dao.store.info();

  intercept(addCommand, 'interaction', async ({ user, command }) => {
    const obj = translate(command.args[0]);
    const room = await user.Room();
    const phrase = command.args.join(' ');

    switch (`${command.name}:${obj.scope}`) {
      case 'open:navigation': {
        const door = await room.Door(obj.code);
        if (!door) throw new AbortActionError('There is nothing in that direction!');
        return user.describe('info', await door.Open());
      }
      case 'close:navigation': {
        const door = await room.Door(obj.code);
        if (!door) throw new AbortActionError('There is nothing in that direction!');
        return user.describe('info', await door.Close());
      }
      case 'get:unknown': {
        const items = await room.Items();
        const index = items.findIndex(it => it.name.indexOf(phrase.toLowerCase()) === 0);
        if (index < 0) throw new AbortActionError(`You don't see ${phrase} here.`);
        const [item] = items.splice(index, 1);
        updateRoom.dispatch({ id: room.id, items });
        updateUser.dispatch({ id: user.id, items: user.items.concat(item.id) });
        return user.describe('info', `You took ${item.name}.`);
      }
      case 'drop:unknown': {
        const items = await user.Items();
        const index = items.findIndex(it => it.name.indexOf(phrase.toLowerCase()) === 0);
        if (index < 0) throw new AbortActionError(`You don't have ${phrase} to drop!`);
        const [item] = items.splice(index, 1);
        updateRoom.dispatch({ id: room.id, items: room.items.concat(item.id) });
        updateUser.dispatch({ id: user.id, items });
        return user.describe('info', `You dropped ${item.name}.`);
      }
      default:
        throw new AbortActionError('Unable to process command.');
    }
  });
};
