module.exports = (server, dao) => {
  const model = dao.addStoreModel('user');

  server.on('connection', async (socket) => {
    const user = await dao.get('user', 1, { socketId: socket.id, isLoggedIn: true });

    socket.on('disconnecting', async (reason) => {
      model.actions.removeUser.dispatch(user, { reason });
    });

    socket.on('disconnect', (reason) => {
      socket.removeAllListeners();
    });

    socket.on('error', (error) => {

    });
  });
};
