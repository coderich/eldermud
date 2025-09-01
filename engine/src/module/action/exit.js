const { Action } = require('@coderich/gameflow');

Action.define('exit', [
  async (_, { actor }) => {
    actor.writeln('You sit down to meditate...');
  },

  () => APP.timeout(3000),

  async ({ reason }, { actor }) => {
    await actor.exit('exit');
    return actor.perform('mainMenu');
  },
]);
