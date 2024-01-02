const Util = require('@coderich/util');
const { Action } = require('@coderich/gameflow');

Action.define('stand', [
  async (command, { abort, actor }) => {
    const posture = await REDIS.set(`${actor}.posture`, 'stand', { GET: true });
    return posture === 'stand' ? abort('You are already standing!') : posture;
  },

  () => Util.timeout(250),

  (_, { actor }) => {
    actor.send('text', 'You hop to your feet.');
  },
]);
