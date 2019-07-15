// https://oss.redislabs.com/redisjson/commands
/*
 [
 "json.mget", "json.type", "json.numincrby", "json.nummultby", "json.strappend",
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

const client = redis.createClient();

const toPromise = (fn, ...args) => {
  return new Promise((resolve, reject) => {
    fn.call(client, ...args, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

export const hydrate = (data) => {
  const [name] = data.id.split('.');
  const modelName = name.charAt(0).toUpperCase() + name.slice(1);
  return Models[modelName] ? new Models[modelName](data) : data;
};

export const getData = async (id, field = '') => {
  return hydrate(JSON.parse(await toPromise(client.json_get, id, `.${field}`)));
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
  return delData(id, `${field}[${index}]`);
};








export const Get = async (id, field = '') => {
  return JSON.parse(await toPromise(client.json_get, id, `.${field}`));
};

export const get = async (id) => {
  const data = await Get(id);
  return hydrate(data);
};

export const Set = async (id, ...args) => {
  let field; let data;
  if (args[1] !== undefined) ([field, data] = args);
  else ([field, data] = ['', args[0]]);
  await toPromise(client.json_set, id, `.${field}`, JSON.stringify(data));
  return Get(id);
};

export const set = async (id, ...args) => {
  const result = await Set(id, ...args);
  return hydrate(result);
};

export const Del = async (id, field = '') => {
  return toPromise(client.json_del, id, `.${field}`);
};

// Fixtures
Object.entries({ ...db, ...tmpl }).forEach(([key, value]) => {
  Set(key, value);
});
