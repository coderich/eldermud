const { Action } = require('@coderich/gameflow');

/**
 * Adds an actor to the realm by their location (map + room)
 */
Action.define('enter', async (_, { actor }) => {
  REDIS.mGet([`${actor}.map`, `${actor}.room`]).then(([map, room]) => {
    CONFIG.get(`${room}.units`).add(actor);

    if (actor.type === 'player') {
      actor.perform('map');
      actor.perform('room');
      actor.roomSearch = new Set();
    }
  });
});
