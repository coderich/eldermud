const { Action } = require('@coderich/gameflow');

Action.define('search', [
  async (command, { actor }) => {
    const target = CONFIG.get(await REDIS.get(`${actor}.room`));
    actor.socket.emit('text', 'You search the room.');
    return { target };
  },
]);