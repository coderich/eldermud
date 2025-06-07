const { Action } = require('@coderich/gameflow');

Action.define('destroy', async (_, { actor }) => {
  //
  actor.removeAllPossibleListeners();

  actor.room.units.delete(actor);
  actor.room.items.delete(actor);

  // Redis cleanup
  const keys = await REDIS.keys(`${actor}.*`);
  await REDIS.del(keys);
});
