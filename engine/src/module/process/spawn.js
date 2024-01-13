const { Action } = require('@coderich/gameflow');

/**
 * Spawn an actor, bind system events and add them to the realm
 */
Action.define('spawn', async (_, { actor }) => {
  await actor.calcStats?.();

  // Save pre-defined attributes if not exists
  await Promise.all(CONFIG.get(`app.spawn.${actor.type}`).map((attr) => {
    const key = `${actor}.${attr}`;
    const value = actor[attr]?.toString();
    return value === undefined ? Promise.resolve() : REDIS.set(key, value, { NX: true });
  }));

  // Assign unit to world
  const [map, room] = await REDIS.mGet([`${actor}.map`, `${actor}.room`]);

  if (['item'].includes(actor.type)) {
    if (room) CONFIG.get(`${room}.items`).add(actor);
  }

  if (['player', 'creature', 'npc'].includes(actor.type)) {
    CONFIG.get(`${room}.units`).add(actor);
  }

  if (actor.type === 'player') {
    actor.perform('map');
    actor.perform('room', CONFIG.get(room));
    actor.roomSearch = new Set();
  }

  // Attach traits
  actor.traits?.forEach(trait => actor.stream('trait', trait));

  return { map, room };
});
