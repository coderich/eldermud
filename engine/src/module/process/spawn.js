const { Action } = require('@coderich/gameflow');

/**
 * Spawn an actor, bind system events and add them to the realm
 */
Action.define('spawn', async (_, { actor }) => {
  await actor.calcStats?.();

  // Save pre-defined attributes (if not exists)
  await actor.save(actor, true);

  // Assign actors to world
  const room = CONFIG.get(await actor.get('room'));

  if (['item', 'key'].includes(actor.type)) {
    if (room) room.items.add(actor);
  }

  if (['player', 'creature', 'npc'].includes(actor.type)) {
    room.units.add(actor);
  }

  // Attach traits
  actor.traits?.forEach((trait) => {
    if (Action[trait.id]) actor.stream('trait', trait.id);
  });

  if (['player', 'npc', 'creature'].includes(actor.type)) {
    actor.perform('map');
    actor.perform('room', room);
  }

  return { room };
});
