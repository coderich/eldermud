const { Action } = require('@coderich/gameflow');

Action.define('status', [
  async (_, { actor }) => {
    const status = await actor.mGet(['hp', 'ma', 'exp', 'posture']);
    status.mhp = actor.mhp;
    status.mma = actor.mma;
    status.posture += 'ing';
    actor.send('status', status);
  },
]);
