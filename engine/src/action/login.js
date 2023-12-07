const { Action } = require('@coderich/gameflow');

Action.define('login', async (_, { actor }) => {
  await DB.set(actor.id, {
    map: 'map.dundeon',
    room: 'room.1',
  });

  actor.perform('map');
});
