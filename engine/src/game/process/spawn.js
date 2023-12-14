const { Action } = require('@coderich/gameflow');

Action.define('spawn', async (_, { actor }) => {
  // STUB out non-player actors
  if (actor.type !== 'player') {
    actor.socket = new Proxy({}, {
      get(target, method) {
        return () => null;
      },
    });
  }

  // Bind system events to this actor
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

  // Add this actor to the realm
  REDIS.mGet([`${actor}.map`, `${actor}.room`]).then(([map, room]) => {
    CONFIG.get(`${room}.units`).add(actor);

    if (actor.type === 'player') {
      actor.perform('map');
      actor.perform('room');
    }
  });
});
