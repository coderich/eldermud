const { Action } = require('@coderich/gameflow');

Action.define('open', [
  async ({ args }, { abort, actor }) => {
    // Door check
    const [dir] = args;
    const { doors } = CONFIG.get(await REDIS.get(`${actor}.room`));
    const door = doors?.[dir];
    return door ? { door, dir } : abort('There is no door in that direction!');
  },
  ({ door, dir }, { actor }) => {
    if (door.status !== 'open') {
      CONFIG.set(`${door}.status`, 'open');
      actor.perform('map');
      actor.socket.emit('text', `You open the door ${APP.direction[dir]}.`);
    } else {
      actor.socket.emit('text', 'The door is already open!');
    }
  },
]);
