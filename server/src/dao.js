import db from './data';

export const set = async (id, data) => {
  db[id] = data;
};

export const del = async (id) => {
  delete db[id];
};

export const get = async (id) => {
  return db[id];
};
