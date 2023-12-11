const Util = require('@coderich/util');
const { Actor } = require('@coderich/gameflow');
const EventEmitter = require('./src/core/EventEmitter');
const ConfigClient = require('./src/core/ConfigClient');
const RedisClient = require('./src/core/RedisClient');
const server = require('./src/server');

(() => {
  //
  global.SYSTEM = new EventEmitter().setMaxListeners(1);
  global.CONFIG = new ConfigClient(`${__dirname}/src/config`);
  global.REDIS = new RedisClient(CONFIG.get('redis'));

  // Load the game
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
    }).then(() => actor.perform('engine'));
  });

  // Start the server
  server.start();
})();
