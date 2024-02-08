const { Action } = require('@coderich/gameflow');

/**
 * Spawn an actor, bind system events and add them to the realm
 */
Action.define('spawn', async (_, { actor }) => {
  actor.calcStats?.();

  // Save pre-defined attributes (if not exists)
  await actor.save(actor, true);

  // Assign actors to world
  const [map, room] = await REDIS.mGet([`${actor}.map`, `${actor}.room`]);
  actor.map = CONFIG.get(`${map}`);
  actor.room = CONFIG.get(`${room}`);

  if (['item'].includes(actor.type)) {
    if (room) CONFIG.get(`${room}.items`).add(actor);
  }

  if (['player', 'creature', 'npc'].includes(actor.type)) {
    CONFIG.get(`${room}.units`).add(actor);
  }

  // Attach traits
  if (actor.type !== 'player') {
    actor.traits?.forEach((trait) => {
      if (Action[trait.id]) actor.stream('trait', trait.id);
    });
  }

  // Bind system events to this actor
  actor.on('*', (event, context) => {
    const [type] = event.split(':');

    if (type === 'pre') {
      // This postpones the action (on the very very first step 0) until SYSTEM events are fired and finished
      context.promise.listen(step => step > 1 || Promise.all([SYSTEM.emit(event, context), SYSTEM.emit('*', event, context)]));
    } else {
      setImmediate(() => {
        SYSTEM.emit(event, context);
        SYSTEM.emit('*', event, context);
      });
    }
  });

  if (['player', 'npc', 'creature'].includes(actor.type)) {
    actor.perform('map');
    actor.perform('room', CONFIG.get(room));
  }

  return { map, room };
});
