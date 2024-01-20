const { Action } = require('@coderich/gameflow');

Action.define('exit', [
  async (_, { actor }) => {
    actor.send('text', 'You sit down to meditate...');
  },

  () => APP.timeout(3000),

  (_, { actor }) => {
    actor.room.units.delete(actor);
    actor.disconnect();
  },
]);
