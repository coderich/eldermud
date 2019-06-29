module.exports = (server, dao) => {
  dao.addStoreModel('room');
  dao.addStoreModel('obstacle');
  dao.addStoreModel('item');
  const { actions: { addUser, removeUser }, selectors } = dao.store.info();

  addUser.listen({
    success: async ({ payload: user }) => {
      const roomChange = selectors.user.thunk(user.id).map((u = {}) => u.room);

      user.subscriptions.push(
        roomChange.subscribe(async (room) => {
          user.describe('room', await dao.get('room', room));
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
