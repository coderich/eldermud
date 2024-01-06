const { Action } = require('@coderich/gameflow');

Action.define('status', [
  async (_, { actor }) => {
    const status = await actor.mGet(['hp', 'ma', 'mhp', 'mma']);
    actor.send('status', status);
  },
]);
