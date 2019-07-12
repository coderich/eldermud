import RequireDir from 'require-dir';
import * as dao from './dao';

const Models = Object.entries(RequireDir('./model')).reduce((prev, [name, obj]) => {
  const [fn] = Object.values(obj);
  return Object.assign(prev, { [name]: fn });
}, {});

const store = {};

export const set = async (id, data) => {
  store[id] = data;
};

export const del = async (id) => {
  delete store[id];
};

export const get = async (id, initialData = {}) => {
  const [name] = id.split('.');
  const tcm = name.charAt(0).toUpperCase() + name.slice(1);

  // Attempt to get data from store
  const storeData = store[id];
  if (storeData) return storeData;

  // Attempt to get data from dao
  const data = await dao.get(id);
  const model = new Models[tcm](Object.assign({}, data, initialData, { dao: { set, del, get } }));
  set(id, model);
  return model;
};
