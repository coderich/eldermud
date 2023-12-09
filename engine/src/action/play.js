const { Action } = require('@coderich/gameflow');

Action.define('play', (_, { actor }) => {
  Redis.mGet([`${actor}.map`, `${actor}.room`]).then(([map, room]) => {
    Config.get(`${map}.rooms.${room}.units`).add(actor);
    actor.perform('map');
    actor.perform('room');
  });

  actor.on('post:move', ({ promise }) => {
    if (!promise.aborted) {
      actor.perform('map');
      actor.perform('room');
    }
  });
});
