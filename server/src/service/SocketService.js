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
