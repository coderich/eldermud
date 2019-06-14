module.exports = (server, store) => {
  const { selectors: storeSelectors, actions: storeActions } = store.info();

  const interpreter = (data) => {
    console.log('commander here to interpret', data);
  };

  // Begin listening to player commands
  storeActions.login.listen({
    success: ({ payload }) => {
      const { id } = payload;
      const socket = storeSelectors.socket.get(id);

      if (socket) {
        socket.on('message', interpreter);
      }
    },
  });

  // Stop listening to player commands
  storeActions.logout.listen({
    success: ({ payload }) => {
      const { id } = payload;
      const socket = storeSelectors.socket.get(id);

      if (socket) {
        socket.removeListener('message', interpreter);
      }
    },
  });
};
