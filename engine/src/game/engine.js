const { Action } = require('@coderich/gameflow');

Action.define('engine', (_, { actor }) => {
  REDIS.mGet([`${actor}.map`, `${actor}.room`]).then(([map, room]) => {
    CONFIG.get(`${room}.units`).add(actor);

    if (actor.type === 'player') {
      actor.perform('map');
      actor.perform('room');
    }
  });

  actor.on('*', (event, data) => {
    const [type] = event.split(':');
    const payload = { actor, ...data };

    if (type === 'pre') {
      data.promise.listen(i => i || Promise.all([SYSTEM.emit(event, payload), SYSTEM.emit('*', event, payload)]));
    } else if (type === 'post') {
      SYSTEM.emit(event, payload);
      SYSTEM.emit('*', event, payload);
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
});
