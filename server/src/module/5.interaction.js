import AbortActionError from '../core/AbortActionError';
import { interceptCommand } from '../service/intercepter.service';

module.exports = (server, dao) => {
  const { actions: { addCommand } } = dao.store.info();

  interceptCommand(addCommand, 'interaction', async ({ user, command }) => {
    const room = await user.Room();
    const doors = await room.Doors();
    const exits = await room.Exits();

    console.log('doors', doors);
    console.log('exits', exits);
    // const items = await room.items();

    switch (command.name) {
      case 'open':
        console.log('open', command.args);
        break;
      default:
        break;
    }
  });
};
