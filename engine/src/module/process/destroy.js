const { Action } = require('@coderich/gameflow');

Action.define('destroy', async (_, { actor }) => {
  //
  actor.removeAllPossibleListeners();

  // Remove from room
  const room = CONFIG.get(await actor.get('room'));
  room.units.delete(actor);
  room.items.delete(actor);

  // Redis cleanup
  const keys = await REDIS.keys(`${actor}.*`);
  console.log(`destroying ${actor} keys:`, keys);
  return REDIS.del(keys);
});
