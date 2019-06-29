import { translate } from '../service/command.service';

module.exports = (server, dao) => {
  const { actions: { addUser } } = dao.store.info();
  const { actions: { addCommand } } = dao.addStoreModel('command');

  // Begin listening to player commands
  addUser.listen({
    success: ({ payload: { id, socket } }) => {
      socket.on('message', async (input) => {
        const command = translate(input);
        const user = await dao.get('user', id);
        addCommand.dispatch({ user, command });
      });
    },
  });

  addCommand.listen({
    success: async ({ payload }) => {
      const { user, command } = payload;

      if (command.name === 'none') {
        user.describe('room', await user.Room());
      } else if (command.name === 'inventory') {
        const items = await user.Items();
        const description = items.length === 0 ? 'nothing!' : items.map(item => item.name).join(', ');
        user.describe('info', `You are carrying: ${description}`);
      } else if (command.name === 'unknown') {
        user.describe('info', 'Your command had no effect.');
      }
    },
    error: ({ payload, meta: { reason } }) => {
      const { user } = payload;
      user.socket.emit('message', { type: 'error', value: reason });
    },
  });
};
