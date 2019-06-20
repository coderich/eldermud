import AbortActionError from '../core/AbortActionError';
import { intercept, translate } from '../service/command.service';

module.exports = (server, dao) => {
  const { actions: { addCommand } } = dao.store.info();

  intercept(addCommand, 'interaction', async ({ user, command }) => {
    const obj = translate(command.args[0]);
    const room = await user.Room();

    switch (`${command.name}:${obj.scope}`) {
      case 'open:navigation': {
        const door = await room.Door(obj.code);
        if (!door) throw new AbortActionError('There is no door in that direction!');
        await door.Open();
        break;
      }
      case 'close:navigation': {
        const door = await room.Door(obj.code);
        if (!door) throw new AbortActionError('There is no door in that direction!');
        await door.Close();
        break;
      }
      default:
        throw new AbortActionError('Unable to process command');
    }
  });
};
