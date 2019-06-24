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
        const room = await user.Room();
        user.socket.emit('message', room);
      }
    },
    error: ({ payload, meta: { reason } }) => {
      const { user } = payload;
      user.socket.emit('message', reason);
    },
  });
};
