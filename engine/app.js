const Util = require('@coderich/util');
const EventEmitter = require('./src/service/EventEmitter');
const ConfigClient = require('./src/service/ConfigClient');
const RedisClient = require('./src/service/RedisClient');
const AppService = require('./src/service/AppService');
const Creature = require('./src/model/Creature');
const Item = require('./src/model/Item');
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
  // Setup our NPCs (Actors)
  Object.values(CONFIG.get('npc', {})).forEach(async (npc) => {
    const actor = new NPC(npc);
    await actor.perform('spawn');
  });

  // Setup our creatures
  await REDIS.keys('creature.*').then((keys) => {
    return keys.length ? REDIS.mGet(keys).then((values) => {
      return keys.reduce((prev, key, i) => {
        const [root, id, counter, attr] = key.split('.');
        const path = `${root}.${id}.${counter}`;
        const ns = `${root}.${id}`;
        prev[path] ??= { ...CONFIG.get(ns) };
        prev[path][attr] = values[i];
        prev[path].toString = () => path;
        return prev;
      }, {});
    }) : [];
  }).then((creatures) => {
    return Promise.all(Object.values(creatures).map(async (creature) => {
      if (creature.room) {
        const actor = new Creature(creature);
        await actor.perform('spawn');
      }
    }));
  });

  // Setup our items
  await REDIS.keys('item.*').then((keys) => {
    return keys.length ? REDIS.mGet(keys).then((values) => {
      return keys.reduce((prev, key, i) => {
        const [root, id, counter, attr] = key.split('.');
        const path = `${root}.${id}.${counter}`;
        const ns = `${root}.${id}`;
        prev[path] ??= { ...CONFIG.get(ns) };
        prev[path][attr] = values[i];
        prev[path].toString = () => path;
        return prev;
      }, {});
    }) : [];
  }).then((items) => {
    return Promise.all(Object.values(items).map(async (item) => {
      const actor = new Item(item);
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
