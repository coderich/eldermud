module.exports = (server, dao) => {
  const { actions } = dao.store.info();
  dao.addStoreModel('room');

  actions.addUser.listen({
    success: async ({ payload: user }) => {
      const room = await dao.get('room', user.room);
      const socket = server.sockets.connected[user.socketId];

      if (socket) {
        socket.emit('message', room);
      }
    },
  });

  actions.removeUser.listen({
    success: async ({ payload: user, meta: { reason } }) => {
      if (user.isLoggedIn) {
        // console.log('Hell to pay!', reason);
      }
    },
  });
};
