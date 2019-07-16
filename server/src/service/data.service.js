// https://oss.redislabs.com/redisjson/commands
/*
 [
 "json.mget", "json.type", "json.nummultby", "json.strappend",
 "json.strlen", "json.arrlen",
 "json.arrtrim", "json.objkeys", "json.objlen", "json.debug", "json.forget", "json.resp"
 ]
*/

import redis from 'redis';
import * as Models from '../model';

import db from '../data';
import tmpl from '../template';

redis.addCommand('json.get');
redis.addCommand('json.set');
redis.addCommand('json.del');
redis.addCommand('json.arrpop');
redis.addCommand('json.arrindex');
redis.addCommand('json.arrinsert');
redis.addCommand('json.arrappend');
redis.addCommand('json.numincrby');

const client = redis.createClient();

const toPromise = (fn, ...args) => {
  return new Promise((resolve, reject) => {
    fn.call(client, ...args, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

const api = {}; // Hack

export const hydrate = (data) => {
  const { id = '' } = data;
  const [name] = id.split('.');
  const modelName = name.charAt(0).toUpperCase() + name.slice(1);
  return Models[modelName] ? new Models[modelName](Object.assign(data, { ...api })) : data;
};

export const getData = async (id, field = '') => {
  return hydrate(JSON.parse(await toPromise(client.json_get, id, `.${field}`)));
};

export const getList = async (id, field) => {
  const list = await getData(id, field);
  return Promise.all(list.map(li => getData(li)));
};

export const setData = async (id, ...args) => {
  let field; let data;
  if (args[1] !== undefined) ([field, data] = args);
  else ([field, data] = ['', args[0]]);
  await toPromise(client.json_set, id, `.${field}`, JSON.stringify(data));
  return getData(id);
};

export const delData = async (id, field = '') => {
  await toPromise(client.json_del, id, `.${field}`);
  return getData(id);
};

export const pushData = async (id, field, data) => {
  await toPromise(client.json_arrappend, id, `.${field}`, JSON.stringify(data));
  return getData(id);
};

export const pullData = async (id, field, data) => {
  const index = await toPromise(client.json_arrindex, id, `.${field}`, JSON.stringify(data));
  const item = await toPromise(client.json_arrpop, id, `.${field}`, index);
  return JSON.parse(item);
};

export const incData = async (id, field, number) => {
  return JSON.parse(await toPromise(client.json_numincrby, id, `.${field}`, number));
};

Object.assign(api, { getData, getList, setData, delData, pushData, pullData });

// Fixtures
Object.entries({ ...db, ...tmpl }).forEach(([key, value]) => {
  setData(key, value);
});
