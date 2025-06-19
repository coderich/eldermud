const { Action } = require('@coderich/gameflow');

Action.define('stand', [
  async (command, { abort, actor }) => {
    const posture = await actor.get('posture');
    return posture === 'stand' ? abort('You are already standing!') : posture;
  },

  () => APP.timeout(250),

  async (_, { actor }) => {
    await REDIS.set(`${actor}.posture`, 'stand');
    actor.send('text', 'You rise to your feet');
  },
]);
