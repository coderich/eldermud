const { Action } = require('@coderich/gameflow');

Action.define('logout', async (_, { actor }) => {
  await CONFIG.get(await REDIS.get(`${actor}.room`)).units.delete(actor);
});
