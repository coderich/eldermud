const Util = require('@coderich/util');
const { Action } = require('@coderich/gameflow');
const EventEmitter = require('./src/service/EventEmitter');
const ConfigClient = require('./src/service/ConfigClient');
const RedisClient = require('./src/service/RedisClient');
const AppService = require('./src/service/AppService');
const NPC = require('./src/model/NPC');
const Actor = require('./src/model/Actor');
const server = require('./src/server');

exports.init = (datadir) => {
  // Yep, globals
  global.SYSTEM = new EventEmitter().setMaxListeners(5);
  global.CONFIG = new ConfigClient();
  global.REDIS = new RedisClient(CONFIG.get('app.redis'));
  global.APP = AppService;

  // Load the game (Actions)
  CONFIG.mergeConfig(datadir);
  Util.requireDir(`${__dirname}/src/module`);
};

exports.setup = async () => {
  // Setup our world
  Object.values(CONFIG.get('map')).forEach((map) => {
    Object.values(map.doors || {}).forEach((door) => {
      if (door.traits) {
        const actor = new Actor(door);
        door.traits.forEach((trait) => {
          if (Action[trait?.id]) actor.stream('trait', trait.id);
        });
      }
    });
  });

  // Setup our NPCs
  Object.values(CONFIG.get('npc', {})).forEach(async (npc) => {
    const actor = await new NPC(npc);
    if (npc.room) await actor.perform('spawn');
  });

  // Setup our instances
  await Promise.all([
    REDIS.keys('key.*'),
    REDIS.keys('npc.*'),
    REDIS.keys('item.*'),
    REDIS.keys('creature.*'),
  ]).then(async (results) => {
    const keys = APP.uniqIdKeys(...results); // Unique keys based on instance/id value
    const actors = await APP.hydrate(keys);
    return Promise.all(actors.map(actor => actor.perform('spawn')));
  });
};

(async () => {
  if (!module.parent) {
    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    });

    console.log('Before load:', process.memoryUsage().heapUsed);
    exports.init(`${__dirname}/src/config`);
    // CONFIG.merge(ConfigClient.parseFile(`${__dirname}/src/database.json`));
    CONFIG.decorate();
    await exports.setup();
    await server.start();
    console.log('After load:', process.memoryUsage().heapUsed);
    console.log('Server ready.');
    SYSTEM.emit('server', {});
  }
})();
