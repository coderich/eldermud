const Util = require('@coderich/util');
const { Action } = require('@coderich/gameflow');

Action.define('move', [
  // Prepare...
  (dir, { actor }) => {
    return Promise.all([
      Redis.mGet([`${actor}.map`, `${actor}.room`]),
      Util.timeout(100),
    ]).then(([[map, room]]) => {
      return { dir, map, room };
    });
  },

  // Attempt to move...
  ({ dir, map, room }, { actor, abort }) => {
    const exit = Config.get(`${map}.rooms.${room}.exits.${dir}.id`);
    if (!exit) return abort('No exit in that direction!');
    return { dir, map, room, exit };
  },

  // Moving...
  () => Util.timeout(250),

  // Moved.
  async ({ map, room, exit }, { actor }) => {
    await Redis.set(`${actor}.room`, exit);
    Config.get(`${map}.rooms.${room}.units`).delete(actor);
    Config.get(`${map}.rooms.${exit}.units`).add(actor);
  },
]);
