const { Action } = require('@coderich/gameflow');

Action.define('exit', [
  async (_, { actor }) => {
    actor.send('text', 'You sit down to meditate...');
  },

  () => APP.timeout(3000),

  async ({ reason }, { actor }) => {
    await actor.exit('exit');
    return actor.perform('mainMenu');
  },
]);
