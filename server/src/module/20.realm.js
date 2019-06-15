module.exports = (server, store) => {
  const { selectors, actions } = store.info();

  // Send initial info to player
  actions.login.listen({
    success: ({ payload }) => {
      const { id, user } = payload;
      const socket = selectors.socket.get(id);
      const room = selectors.room.get(user.room);

      if (socket) {
        socket.emit('message', room);
      }
    },
  });

  // Check if the player hung up without logging out first (potential penalty if in combat)
  actions.disconnect.listen({
    request: ({ payload }) => {
      const { id } = payload;
      const player = selectors.playerBySocket.get(id);

      if (player) {
        console.log('You are in big trouble');
      }
    },
  });

  store.loadModule('realm', { selectors });
};
