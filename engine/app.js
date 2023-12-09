const Util = require('@coderich/util');
const { Actor } = require('@coderich/gameflow');
const ConfigClient = require('./src/client/ConfigClient');
const RedisClient = require('./src/client/RedisClient');
const server = require('./src/server');

(() => {
  //
  global.CONFIG = new ConfigClient(`${__dirname}/src/config`);
  global.REDIS = new RedisClient(CONFIG.get('redis'));

  // Load the game
  Util.requireDir(`${__dirname}/src/game`);

  // Setup our in-game Actors
  Object.entries(CONFIG.get('npc')).forEach(([key, value]) => {
    const npc = Object.assign(Actor.define(`npc.${key}`), {
      ...value,
      toString: () => `eldermud:npc.${key}`,
    });

    // console.log(`${npc}`, value.room.id, value.map.id);

    // REDIS.mSetNX({
    //   [`${npc}.room`]: value.room.id,
    //   [`${npc}.map`]: value.map.id,
    // }).then(() => npc.perform('engine'));
  });

  // Start the server
  server.start();
})();
