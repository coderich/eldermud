const { Action } = require('@coderich/gameflow');

Action.define('rest', [
  async (command, { actor }) => {
    const posture = await REDIS.set(`${actor}.posture`, 'rest', { GET: true });
    const message = posture === 'rest' ? 'You are already resting!' : 'You are now resting.';
    actor.socket.emit('text', message);
  },
]);
