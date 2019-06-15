import server from '../server';

exports.findById = async (id) => {
  return server.sockets.connected[id];
};

exports.findByUser = async (id) => {
  return Object.values(server.sockets.connected).find(socket => socket.userId === id);
};
