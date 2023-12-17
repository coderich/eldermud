const { Action } = require('@coderich/gameflow');

Action.define('enter', async (_, { actor }) => {
  // Add this actor to the realm
  REDIS.mGet([`${actor}.map`, `${actor}.room`]).then(([map, room]) => {
    CONFIG.get(`${room}.units`).add(actor);

    if (actor.type === 'player') {
      actor.perform('map');
      actor.perform('room');
    }
  });
});
