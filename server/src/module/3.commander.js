import InterpreterService from '../service/interpreter.service';

module.exports = (server, dao) => {
  const { actions: { addUser } } = dao.store.info();
  const { actions: { addCommand } } = dao.addStoreModel('command');

  // Begin listening to player commands
  addUser.listen({
    success: ({ payload: user }) => {
      const socket = server.sockets.connected[user.socketId];

      if (socket) {
        socket.on('message', (input) => {
          const command = InterpreterService.translate(input);
          addCommand.dispatch({ user, command });
        });
      }
    },
  });

  addCommand.listen({
    success: async ({ payload }) => {
      const { user, command } = payload;
      const socket = server.sockets.connected[user.socketId];

      if (command.name === 'none') {
        const room = await user.hydrate('room');
        socket.emit('message', room);
      }
    },
    error: ({ payload, meta: { reason } }) => {
      const { user } = payload;
      const socket = server.sockets.connected[user.socketId];

      if (socket) {
        socket.emit('message', reason);
      }
    },
  });
};
