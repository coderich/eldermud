import db from './data';

export const set = async (modelName, id, data) => {
  const lcm = modelName.toLowerCase();
  db[`${lcm}.${id}`] = data;
};

export const del = async (modelName, id) => {
  const lcm = modelName.toLowerCase();
  delete db[`${lcm}.${id}`];
};

export const get = async (modelName, id) => {
  const lcm = modelName.toLowerCase();
  return db[`${lcm}.${id}`];
};
