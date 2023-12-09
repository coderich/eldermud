const { Action } = require('@coderich/gameflow');

Action.define('engine', (_, { actor }) => {
  Redis.mGet([`${actor}.map`, `${actor}.room`]).then(([map, room]) => {
    Config.get(`${map}.rooms.${room}.units`).add(actor);
    actor.perform('map');
    actor.perform('room');
  });

  actor.on('post:translate', ({ result }) => {
    switch (result.scope) {
      case 'navigation': return actor.stream(actor.streams.navigation, 'move', result.code);
      default: return null;
    }
  });

  actor.on('post:move', ({ promise }) => {
    if (promise.aborted) {
      actor.socket.emit('text', promise.reason);
    } else {
      actor.perform('map');
      actor.perform('room');
    }
  });

  actor.on('post:logout', () => {
    // console.log('user logged out');
  });
});
