const Util = require('@coderich/util');
const EventEmitter = require('./src/service/EventEmitter');
const ConfigClient = require('./src/service/ConfigClient');
const RedisClient = require('./src/service/RedisClient');
const AppService = require('./src/service/AppService');
const NPC = require('./src/model/NPC');
const server = require('./src/server');

exports.init = (datadir) => {
  // Yep, globals
  global.SYSTEM = new EventEmitter().setMaxListeners(5);
  global.CONFIG = new ConfigClient().mergeConfig(datadir);
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
  ]).then(async (results) => {
    // Unique set of keys (up until the numeric segment)
    const keys = new Set(results.flat(2).map((key) => {
      const arr = key.split('.');
      const index = arr.findIndex(el => APP.isNumeric(el));
      return arr.slice(0, index + 1).join('.');
    }));

    // Hydrate and spawn instances
    const actors = await APP.hydrate(Array.from(keys.values()));
    return Promise.all(actors.map(actor => actor.perform('spawn')));
  });
};

(async () => {
  if (!module.parent) {
    exports.init(`${__dirname}/config/data`);
    // CONFIG.merge(ConfigClient.parseFile(`${__dirname}/src/database.json`));
    CONFIG.decorate();
    await exports.setup();
    server.start();
    console.log('Server ready.');
  }
})();
