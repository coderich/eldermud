import { getData } from './data.service';

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

export const toRoom = async (roomId, type, payload) => {
  const room = await getData(roomId);
  const players = await room.Players();
  players.forEach(player => player.emit(type, payload));
};
