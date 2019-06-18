module.exports = (server, dao) => {
  const { actions: { addUser, removeUser }, selectors } = dao.store.info();

  dao.addStoreModel('room');
  dao.addStoreModel('obstacle');

  addUser.listen({
    success: async ({ payload: user }) => {
      const socket = server.sockets.connected[user.socketId];

      const roomChange = selectors.user.thunk(user.id).map((u = {}) => u.room);

      user.subscriptions.push(
        roomChange.subscribe(async () => {
          const newRoom = await user.get('room');
          socket.emit('message', newRoom);
        }),
      );
    },
  });

  removeUser.listen({
    success: async ({ payload: user, meta: { reason } }) => {
      if (user.isLoggedIn) {
        // console.log('Hell to pay!', reason);
      }
    },
  });
};
