const Util = require('@coderich/util');
const { Action } = require('@coderich/gameflow');

Action.define('move', [
  // Prepare...
  (dir, { actor }) => {
    return Promise.all([
      REDIS.mGet([`${actor}.map`, `${actor}.room`]),
      Util.timeout(100),
    ]).then(([[map, room]]) => {
      return { dir, map, room };
    });
  },

  // Attempt to move...
  ({ dir, map, room }, { actor, abort }) => {
    const exit = CONFIG.get(`${map}.rooms.${room}.exits.${dir}.id`);
    if (!exit) return abort('No exit in that direction!');
    return { dir, map, room, exit };
  },

  // Moving...
  () => Util.timeout(250),

  // Moved.
  async ({ map, room, exit }, { actor }) => {
    await REDIS.set(`${actor}.room`, exit);
    CONFIG.get(`${map}.rooms.${room}.units`).delete(actor);
    CONFIG.get(`${map}.rooms.${exit}.units`).add(actor);
  },
]);
