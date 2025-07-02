const { Action } = require('@coderich/gameflow');

Action.define('logout', async ({ reason }, { actor }) => {
  CONFIG.get(await actor.get('room')).units?.delete(actor);
  if (!reason) return actor.realm('text', APP.styleText('gesture', `${actor.name} just hung up!`));
  return actor.realm('text', `${actor.name} has left the realm.`);
});
