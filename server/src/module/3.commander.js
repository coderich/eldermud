import InterpreterService from '../service/interpreter.service';

module.exports = (server, dao) => {
  const { actions } = dao.store.info();
  const commander = dao.addStoreModel('command');

  // Begin listening to player commands
  actions.addUser.listen({
    success: ({ payload: user }) => {
      const socket = server.sockets.connected[user.socketId];

      if (socket) {
        socket.on('message', (input) => {
          const command = InterpreterService.translate(input);
          commander.actions.addCommand.dispatch({ user, command });
        });
      }
    },
  });

  commander.actions.addCommand.listen({
    success: ({ payload: command }) => {
      const { user } = command;
      const socket = server.sockets.connected[user.socketId];

      if (socket) {
        socket.emit('message', 'ok');
      }
    },
    error: ({ payload: command, meta: { reason } }) => {
      const { user } = command;
      const socket = server.sockets.connected[user.socketId];

      if (socket) {
        socket.emit('message', reason);
      }
    },
  });
};
