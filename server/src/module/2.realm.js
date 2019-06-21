module.exports = (server, dao) => {
  dao.addStoreModel('room');
  dao.addStoreModel('obstacle');
  const { actions: { addUser, removeUser }, selectors } = dao.store.info();

  addUser.listen({
    success: async ({ payload: user }) => {
      const roomChange = selectors.user.thunk(user.id).map((u = {}) => u.room);

      user.subscriptions.push(
        roomChange.subscribe(async (room) => {
          const newRoom = await dao.get('room', room);
          user.socket.emit('message', newRoom);
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
