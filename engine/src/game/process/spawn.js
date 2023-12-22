const { Action } = require('@coderich/gameflow');

/**
 * Spawn an actor, bind system events and prepare them to enter the realm
 */
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
});
