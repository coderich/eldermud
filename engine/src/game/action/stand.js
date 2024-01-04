const Util = require('@coderich/util');
const { Action } = require('@coderich/gameflow');

Action.define('stand', [
  async (command, { abort, actor }) => {
    const posture = await REDIS.get(`${actor}.posture`);
    return posture === 'stand' ? abort('You are already standing!') : posture;
  },

  () => Util.timeout(2500),

  async (_, { actor }) => {
    await REDIS.set(`${actor}.posture`, 'stand');
    actor.send('text', 'You hop to your feet.');
  },
]);
