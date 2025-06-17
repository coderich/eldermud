const { Action } = require('@coderich/gameflow');

Action.define('exit', [
  async (_, { actor }) => {
    actor.send('text', 'You sit down to meditate...');
  },

  () => APP.timeout(3000),

  async (_, { actor }) => {
    const exit = CONFIG.get(await actor.get('room'));
    exit.units.delete(actor);
    actor.disconnect();
    return { exit };
  },
]);
