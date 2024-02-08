const Util = require('@coderich/util');
const EventEmitter = require('./src/service/EventEmitter');
const ConfigClient = require('./src/service/ConfigClient');
const RedisClient = require('./src/service/RedisClient');
const AppService = require('./src/service/AppService');
const NPC = require('./src/model/NPC');
const server = require('./src/server');

exports.init = (datadir, mapdir) => {
  // Yep, globals
  global.SYSTEM = new EventEmitter().setMaxListeners(5);
  global.CONFIG = new ConfigClient().mergeConfig(datadir).mergeConfig(mapdir, ['map']);
  global.REDIS = new RedisClient(CONFIG.get('app.redis'));
  global.APP = AppService;

  // Load the game (Actions)
  Util.requireDir(`${__dirname}/src/module`);
};

exports.setup = async () => {
  // Setup our NPCs
  Object.values(CONFIG.get('npc', {})).forEach((map) => {
    Object.values(map).forEach(async (npc) => {
      const actor = new NPC(npc);
      await actor.perform('spawn');
    });
  });

  // Setup our instances
  await Promise.all([
    REDIS.keys('key.*'),
    REDIS.keys('item.*'),
    REDIS.keys('creature.*'),
  ]).then((keys) => {
    keys = keys.flat();
    return keys.length ? REDIS.mGet(keys).then((values) => {
      return keys.reduce((prev, key, i) => {
        key = key.split('.');
        // const [root, id, counter, attr] = key.split('.');
        const root = key.shift();
        const attr = key.pop();
        const counter = key.pop();
        const id = key.pop();
        const path = `${root}.${id}.${counter}`;
        const ns = `${root}.${id}`;
        prev[path] ??= { ...CONFIG.get(ns) };
        prev[path][attr] = values[i];
        prev[path].toString = () => path;
        return prev;
      }, {});
    }) : [];
  }).then((items) => {
    return Promise.all(Object.values(items).map(async (conf) => {
      const actor = APP.hydrate(`${conf}`, conf);
      await actor.perform('spawn');
    }));
  });
};

(async () => {
  if (!module.parent) {
    exports.init(`${__dirname}/config/data`, `${__dirname}/config/map`);
    // CONFIG.merge(ConfigClient.parseFile(`${__dirname}/src/database.json`));
    CONFIG.decorate();
    await exports.setup();
    server.start();
    console.log('Server ready.');
  }
})();
