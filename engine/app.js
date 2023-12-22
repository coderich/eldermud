const Util = require('@coderich/util');
const { Actor } = require('@coderich/gameflow');
const EventEmitter = require('./src/global/EventEmitter');
const ConfigClient = require('./src/global/ConfigClient');
const RedisClient = require('./src/global/RedisClient');
const AppService = require('./src/global/AppService');
const server = require('./src/server');

(() => {
  // Yep, globals
  global.SYSTEM = new EventEmitter().setMaxListeners(5);
  global.CONFIG = new ConfigClient(`${__dirname}/src/config`);
  global.REDIS = new RedisClient(CONFIG.get('redis'));
  global.APP = AppService;

  // Load the game (Actions)
  Util.requireDir(`${__dirname}/src/game`);

  // Setup our in-game NPCs
  Object.values(CONFIG.get('npc')).forEach((npc) => {
    const actor = Object.assign(Actor.define(`${npc}`), { ...npc, toString: () => `${npc}` });

    REDIS.mSetNX({ [`${actor}.room`]: `${npc.room}`, [`${actor}.map`]: `${npc.map}` }).then(async () => {
      await actor.perform('spawn');
      await actor.perform('enter');
    });
  });

  // Setup our in-game creatures
  Object.values(CONFIG.get('map')).forEach((map) => {
    Object.values(map.rooms).forEach((room) => {
      room.spawns?.forEach(({ num, units }) => {
        APP.instantiate(units).then((creatures) => {
          creatures.forEach((creature) => {
            const actor = Object.assign(Actor.define(`${creature}`), { ...creature, toString: () => `${creature}` });

            REDIS.mSetNX({ [`${actor}.room`]: `${room}`, [`${actor}.map`]: `${map}` }).then(async () => {
              await actor.perform('spawn');
              await actor.perform('enter');
            });
          });
        });
      });
    });
  });

  // Start the server
  server.start();
  console.log('Server ready.');
})();
