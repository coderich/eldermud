/*
 [
 "json.mget", "json.type", "json.numincrby", "json.nummultby", "json.strappend",
 "json.strlen", "json.arrappend", "json.arrindex", "json.arrinsert", "json.arrlen",
 "json.arrpop", "json.arrtrim", "json.objkeys", "json.objlen", "json.debug", "json.forget", "json.resp"
 ]
*/

import redis from 'redis';
import RequireDir from 'require-dir';

const Models = Object.entries(RequireDir('./model')).reduce((prev, [name, obj]) => {
  const [fn] = Object.values(obj);
  return Object.assign(prev, { [name]: fn });
}, {});

const toPromise = (fn, ...args) => {
  return new Promise((resolve, reject) => {
    fn(...args, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

redis.addCommand('json.get');
redis.addCommand('json.set');
redis.addCommand('json.del');

const client = redis.createClient();

export const get = async (id, field = '') => {
  const [name] = id.split('.');
  const modelName = name.charAt(0).toUpperCase() + name.slice(1);
  const data = JSON.parse(await toPromise(client.json_get, id, `.${field}`));
  return new Models[modelName](data);
};

export const set = async (id, ...args) => {
  let field; let data;
  if (args[1]) ([field, data] = args);
  else ([field, data] = ['', args[0]]);
  return toPromise(client.json_set, id, `.${field}`, JSON.stringify(data));
};

export const del = async (id, field = '') => {
  return toPromise(client.json_del, id, `.${field}`);
};
