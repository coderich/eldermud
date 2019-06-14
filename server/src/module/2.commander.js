module.exports = (server, store) => {
  const { selectors: storeSelectors, actions: storeActions } = store.info();

  const interpreter = (data) => {
    console.log('commander here to interpret', data);
  };

  storeActions.login.listen({
    success: ({ payload }) => {
      const { id } = payload;
      const socket = storeSelectors.socket.get(id);

      if (socket) {
        socket.on('message', interpreter);
      }
    },
  });

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
