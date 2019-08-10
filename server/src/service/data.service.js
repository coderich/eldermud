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
import { getCoords } from './util.service';

import db from '../db';
import gameData from '../game/data';
import * as maps from '../game/maps';

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

export const hydrate = async (data) => {
  const { id = '' } = data || {};
  const [name] = id.split('.');
  const modelName = name.charAt(0).toUpperCase() + name.slice(1);

  if (Models[modelName]) {
    return new Models[modelName](Object.assign(data, { ...api })).initialize();
  }

  return data;
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
  const result = await toPromise(client.json_set, id, `.${field}`, JSON.stringify(data));
  if (field === '') return hydrate(data);
  return result;
};

export const delData = async (id, field = '') => {
  return toPromise(client.json_del, id, `.${field}`);
};

export const pushData = async (id, field, data) => {
  return toPromise(client.json_arrappend, id, `.${field}`, JSON.stringify(data));
};

export const pullData = async (id, field, data) => {
  const index = await toPromise(client.json_arrindex, id, `.${field}`, JSON.stringify(data));
  return JSON.parse(await toPromise(client.json_arrpop, id, `.${field}`, index));
};

export const incData = async (id, field, number) => {
  return JSON.parse(await toPromise(client.json_numincrby, id, `.${field}`, number));
};

Object.assign(api, { getData, getList, setData, delData, pushData, pullData, incData });

// Bootrap
(async () => {
  const mapRealm = async (map, room, row, col) => {
    const id = `${row}.${col}`;
    if (map[id]) return;

    map[id] = { id: room.id, row, col, dirs: Object.keys(room.exits) };
    const dirs = Object.keys(room.exits);

    await Promise.all(dirs.map(async (dir) => {
      const coor = getCoords(row, col, dir);
      const nextRoom = await room.Exit(dir);
      return mapRealm(map, nextRoom, coor.row, coor.col);
    }));
  };

  // Load all data fixtures
  await Promise.all(Object.entries({ ...db, ...gameData }).map(([key, value]) => setData(key, value)));
  await Promise.all(Object.entries(maps.academy).map(([key, value]) => setData(key, value)));

  // Create map of realm
  const map = {};
  const startRoom = await getData('room.1');
  await mapRealm(map, startRoom, 0, 0);
  await setData('map', map);
})();
