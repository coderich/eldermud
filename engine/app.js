const Util = require('@coderich/util');
const { Actor } = require('@coderich/gameflow');
const EventEmitter = require('./src/global/EventEmitter');
const ConfigClient = require('./src/global/ConfigClient');
const RedisClient = require('./src/global/RedisClient');
const AppService = require('./src/global/AppService');
const server = require('./src/server');

(() => {
  // Yep, globals
  global.SYSTEM = new EventEmitter().setMaxListeners(1);
  global.CONFIG = new ConfigClient(`${__dirname}/src/config`);
  global.REDIS = new RedisClient(CONFIG.get('redis'));
  global.APP = AppService;

  // Load the game (Actions)
  Util.requireDir(`${__dirname}/src/game`);

  // Setup our in-game Actors
  Object.values(CONFIG.get('npc')).forEach((npc) => {
    const actor = Object.assign(Actor.define(`${npc}`), {
      ...npc,
      toString: () => `eldermud:${npc}`,
    });

    REDIS.mSetNX({
      [`${actor}.room`]: `${npc.room}`,
      [`${actor}.map`]: `${npc.map}`,
    }).then(() => actor.perform('spawn'));
  });

  // Start the server
  server.start();
})();
