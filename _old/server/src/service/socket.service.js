const sockets = {};

export const getSocket = (id) => {
  return sockets[id];
};

export const setSocket = (id, socket) => {
  sockets[id] = socket;
};

export const unsetSocket = (id) => {
  delete sockets[id];
};

export const emit = (id, type, payload) => {
  const socket = getSocket(id);
  if (socket) socket.emit(type, payload);
};

export const broadcast = async (ids, type, payload) => {
  ids.forEach(id => emit(id, type, payload));
};

export const toRoom = async (room, type, payload, options = {}) => {
  let players = await room.Players();
  if (options.omit) players = players.filter(it => options.omit.indexOf(it.id) === -1);
  players.forEach(player => player.emit(type, payload));
};
