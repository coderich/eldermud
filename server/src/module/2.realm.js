// import { Selector } from '@coderich/hotrod';

module.exports = (server, dao) => {
  const { actions, selectors } = dao.store.info();
  dao.addStoreModel('room');

  actions.addUser.listen({
    success: async ({ payload: user }) => {
      const socket = server.sockets.connected[user.socketId];

      const thunk = selectors.user.thunk(user.id).map((u = {}) => u.room);

      thunk.subscribe(async () => {
        const newRoom = await user.get('room');
        socket.emit('message', newRoom);
      });
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
