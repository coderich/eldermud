const { Action } = require('@coderich/gameflow');

/**
 * Spawn an actor, bind system events and prepare them to enter the realm
 */
Action.define('spawn', async (_, { actor }) => {
  // Save attributes if not exists
  await Promise.all(CONFIG.get('app.unitDBAttrs').map((attr) => {
    const key = `${actor}.${attr}`;
    const value = actor[attr]?.toString();
    return value === undefined ? Promise.resolve() : REDIS.set(key, value, { NX: true });
  }));

  // Bind system events to this actor
  actor.on('*', (event, context) => {
    const [type] = event.split(':');

    if (type === 'pre') {
      // This postpones the action (on the very very first step 0) until SYSTEM events are fired and finished
      context.promise.listen(i => i || Promise.all([SYSTEM.emit(event, context), SYSTEM.emit('*', event, context)]));
    } else if (type === 'post') {
      SYSTEM.emit(event, context);
      SYSTEM.emit('*', event, context);
    }
  });
});
