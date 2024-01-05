const Util = require('@coderich/util');
const EventEmitter = require('./src/service/EventEmitter');
const ConfigClient = require('./src/service/ConfigClient');
const RedisClient = require('./src/service/RedisClient');
const AppService = require('./src/service/AppService');
const Creature = require('./src/model/Creature');
const NPC = require('./src/model/NPC');
const server = require('./src/server');

(async () => {
  // Yep, globals
  global.SYSTEM = new EventEmitter().setMaxListeners(5);
  global.CONFIG = new ConfigClient(`${__dirname}/src/data`);
  global.REDIS = new RedisClient(CONFIG.get('app.redis'));
  global.APP = AppService;

  // Load the game (Actions)
  Util.requireDir(`${__dirname}/src/game`);

  // Setup our NPCs (Actors)
  Object.values(CONFIG.get('npc')).forEach(async (npc) => {
    const actor = new NPC(npc);
    await actor.perform('spawn');
    await actor.perform('enter');
  });

  // Setup our creatures (Actors)
  await REDIS.keys('creature.*').then((keys) => {
    return keys.length ? REDIS.mGet(keys).then((values) => {
      return keys.reduce((prev, key, i) => {
        const [root, id, counter, attr] = key.split('.');
        const path = `${root}.${id}.${counter}`;
        const ns = `${root}.${id}`;
        prev[path] ??= CONFIG.get(ns);
        prev[path][attr] = values[i];
        prev[path].toString = () => path;
        return prev;
      }, {});
    }) : [];
  }).then((creatures) => {
    return Promise.all(Object.values(creatures).map(async (creature) => {
      const actor = new Creature(creature);
      await actor.perform('spawn');
      await actor.perform('enter');
    }));
  });

  // Start the server
  server.start();
  console.log('Server ready.');
})();
