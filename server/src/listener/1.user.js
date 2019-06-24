module.exports = (server, dao) => {
  const { actions: { removeUser } } = dao.store.info();

  server.on('connection', async (socket) => {
    const user = await dao.get('user', 1, { socket, isLoggedIn: true, subscriptions: [] });

    socket.on('disconnecting', async (reason) => {
      user.subscriptions.forEach(subscription => subscription.unsubscribe());
      removeUser.dispatch(user, { reason });
    });

    socket.on('disconnect', (reason) => {
      socket.removeAllListeners();
    });

    socket.on('error', (error) => {

    });
  });
};
