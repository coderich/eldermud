import AbortActionError from '../core/AbortActionError';
import { interceptCommand } from '../service/intercepter.service';

module.exports = (server, dao) => {
  const { actions: { addCommand } } = dao.store.info();

  interceptCommand(addCommand, 'interaction', async ({ user, command }) => {
    switch (command.name) {
      case 'open':
        console.log('open', command.args);
        break;
      default:
        break;
    }
  });
};
