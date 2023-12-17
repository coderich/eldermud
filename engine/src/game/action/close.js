const { Action } = require('@coderich/gameflow');

Action.define('close', [
  async ({ args }, { abort, actor }) => {
    // Door check
    const [dir] = args;
    const { doors } = CONFIG.get(await REDIS.get(`${actor}.room`));
    const door = doors?.[dir];
    return door ? { door, dir } : abort('There is no door in that direction!');
  },
  ({ door, dir }, { actor }) => {
    if (door.status !== 'closed') {
      CONFIG.set(`${door}.status`, 'closed');
      actor.perform('map');
      actor.socket.emit('text', `You close the door ${APP.direction[dir]}.`);
    } else {
      actor.socket.emit('text', 'The door is already closed!');
    }
  },
]);
