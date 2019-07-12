import RequireDir from 'require-dir';
import * as dao from './dao';

const Models = Object.entries(RequireDir('./model')).reduce((prev, [name, obj]) => {
  const [fn] = Object.values(obj);
  return Object.assign(prev, { [name]: fn });
}, {});

const store = {};

export const set = async (modelName, id, data) => {
  const lcm = modelName.toLowerCase();
  store[`${lcm}.${id}`] = data;
};

export const del = async (modelName, id) => {
  const lcm = modelName.toLowerCase();
  delete store[`${lcm}.${id}`];
};

export const get = async (modelName, id, initialData = {}) => {
  const lcm = modelName.toLowerCase();
  const tcm = modelName.charAt(0).toUpperCase() + modelName.slice(1);

  // Attempt to get data from store
  const storeData = store[`${lcm}.${id}`];
  if (storeData) return storeData;

  // Attempt to get data from dao
  const data = await dao.get(modelName, id);
  const model = new Models[tcm](Object.assign({}, data, initialData, { dao: { set, del, get } }));
  set(modelName, id, model);
  return model;
};
