const Util = require('@coderich/util');
const EventEmitter = require('./src/service/EventEmitter');
const ConfigClient = require('./src/service/ConfigClient');
const RedisClient = require('./src/service/RedisClient');
const AppService = require('./src/service/AppService');
const Creature = require('./src/model/Creature');
const NPC = require('./src/model/NPC');
const server = require('./src/server');

(() => {
  // Yep, globals
  global.SYSTEM = new EventEmitter().setMaxListeners(5);
  global.CONFIG = new ConfigClient(`${__dirname}/data`);
  global.REDIS = new RedisClient(CONFIG.get('redis'));
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
  Object.values(CONFIG.get('map')).forEach((map) => {
    Object.values(map.rooms).forEach((room) => {
      room.spawns?.forEach(({ num, units }) => {
        APP.instantiate(units).then((creatures) => {
          creatures.forEach(async (creature) => {
            const actor = new Creature({ ...creature, map, room });
            await actor.perform('spawn');
            await actor.perform('enter');
          });
        });
      });
    });
  });

  // Start the server
  server.start();
  console.log('Server ready.');
})();
