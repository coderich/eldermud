const { Action } = require('@coderich/gameflow');

Action.define('logout', async (_, { actor }) => {
  CONFIG.get(await actor.get('room')).units?.delete(actor);
});
