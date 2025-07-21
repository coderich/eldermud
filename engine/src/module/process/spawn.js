const { Action } = require('@coderich/gameflow');

/**
 * Spawn an actor, bind system events and add them to the realm
 */
Action.define('spawn', async (_, { actor }) => {
  //
  await actor.calcStats?.();
  await actor.save(actor, true);

  // Assign actors to world
  const room = CONFIG.get(await actor.get('room'));

  if (['item', 'key'].includes(actor.type)) {
    if (room) room.items.add(actor);
  }

  if (['player', 'creature', 'npc'].includes(actor.type)) {
    if (room) room.units.add(actor);
  }

  // Attach traits
  actor.traits?.forEach((trait) => {
    if (Action[trait?.id]) actor.stream('trait', trait.id);
  });

  // Bind system events to this actor
  actor.on('*', (event, context) => {
    const [type] = event.split(':');
    if (type === 'pre') context.promise.listen(step => step > 1 || SYSTEM.emit(event, context)); // This postpones the action (on the very very first step 0) until SYSTEM events are fired and finished
    else SYSTEM.emit(event, context);
  });

  if (['player', 'npc', 'creature'].includes(actor.type)) {
    actor.perform('map');
    actor.perform('room', room);
  }

  return { room, target: actor };
});
