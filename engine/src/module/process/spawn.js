const { Action } = require('@coderich/gameflow');

/**
 * Spawn an actor, bind system events and add them to the realm
 */
Action.define('spawn', async (_, { actor }) => {
  //
  await actor.calcStats?.();
  await actor.save(actor, true);

  // Bind system events to this actor
  actor.on('*', (event, context) => {
    const [type] = event.split(':');
    if (type === 'pre') context.promise.listen(step => step > 1 || SYSTEM.emit(event, context)); // This postpones the action (on the very very first step 0) until SYSTEM events are fired and finished
    else SYSTEM.emit(event, context);
  });

  // Assign actors to world
  const room = CONFIG.get(await actor.get('room'));

  if (['item', 'key'].includes(actor.type)) {
    if (room) room.items.add(actor);
  }

  if (['player', 'creature', 'npc'].includes(actor.type)) {
    if (room) room.units.add(actor);
  }

  // Attach traits
  actor.traits?.forEach(async (trait) => {
    if (Action[trait?.id]) actor.stream('trait', trait.id);
  });

  if (['player', 'npc', 'creature'].includes(actor.type)) {
    await actor.perform('map');
    await actor.perform('room', room);
  }

  return { room, target: actor };
});
