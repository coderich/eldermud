const Util = require('@coderich/util');
const { Action } = require('@coderich/gameflow');

Action.define('move', [
  () => Util.timeout(250),

  async (dir, { actor, abort }) => {
    const [map, room] = await Redis.mGet([`${actor}.map`, `${actor}.room`]);
    const exit = Config.get(`data.${map}`)?.[room]?.exits?.[dir];
    if (!exit) {
      actor.socket.emit('text', 'No exit in that direction!');
      abort('No exit in that direction!');
    }
    return exit;
  },

  () => Util.timeout(1000),

  async (exit, { actor }) => {
    await Redis.set(`${actor}.room`, exit);
    actor.perform('map');
  },
]);
