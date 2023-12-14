const { Action } = require('@coderich/gameflow');

Action.define('rest', [
  async (command, context) => {
    const { actor } = context;
    const posture = await REDIS.set(`${actor}.posture`, 'rest', { GET: true });
    const message = posture === 'rest' ? 'You are already resting!' : 'You are now resting.';
    actor.socket.emit('text', message);
  },
]);
