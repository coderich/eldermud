/*
 [
 "json.mget", "json.type", "json.numincrby", "json.nummultby", "json.strappend",
 "json.strlen", "json.arrappend", "json.arrindex", "json.arrinsert", "json.arrlen",
 "json.arrpop", "json.arrtrim", "json.objkeys", "json.objlen", "json.debug", "json.forget", "json.resp"
 ]
*/

import redis from 'redis';
import * as Models from '../model';

import db from '../data';
import tmpl from '../template';

redis.addCommand('json.get');
redis.addCommand('json.set');
redis.addCommand('json.del');

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
  return new Models[modelName](data);
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
  if (args[1]) ([field, data] = args);
  else ([field, data] = ['', args[0]]);
  await toPromise(client.json_set, id, `.${field}`, JSON.stringify(data));
  return Get(id, field);
};

export const set = async (id, data) => {
  return hydrate((await Set(id, data)));
};

export const Del = async (id, field = '') => {
  return toPromise(client.json_del, id, `.${field}`);
};

// Fixtures
Object.entries({ ...db, ...tmpl }).forEach(([key, value]) => {
  Set(key, value);
});
