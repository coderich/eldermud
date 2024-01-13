const Util = require('@coderich/util');
const { Action } = require('@coderich/gameflow');

Action.define('exit', [
  async (_, { actor }) => {
    actor.send('text', 'You sit down to meditate...');
  },

  () => Util.timeout(3000),

  (_, { actor }) => {
    actor.disconnect();
  },
]);
