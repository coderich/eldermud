import db from './data';
import tmpl from './template';

export const set = async (id, data) => {
  db[id] = data;
};

export const del = async (id) => {
  delete db[id];
};

export const get = async (id) => {
  return db[id];
};

export const template = async (id) => {
  return tmpl[id];
};
