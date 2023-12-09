const { Action } = require('@coderich/gameflow');

Action.define('engine', (_, { actor }) => {
  REDIS.mGet([`${actor}.map`, `${actor}.room`]).then(([map, room]) => {
    CONFIG.get(`${map}.rooms.${room}.units`).add(actor);
    actor.perform('map');
    actor.perform('room');
  });

  actor.on('post:translate', ({ result }) => {
    switch (result.scope) {
      case 'navigation': return actor.stream(actor.streams.navigation, 'move', result.code);
      default: return actor.socket.emit('text', `You say "${result.input}"`);
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
