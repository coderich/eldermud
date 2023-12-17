const { Action } = require('@coderich/gameflow');

Action.define('search', [
  async (command, { actor }) => {
    const target = CONFIG.get(await REDIS.get(`${actor}.room`));
    return { target };
    // return room?.search?.(null, context) || actor.socket.emit('text', 'Your search revealed nothing.');
  },
]);
