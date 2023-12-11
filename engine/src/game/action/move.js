const Util = require('@coderich/util');
const { Action } = require('@coderich/gameflow');

Action.define('move', [
  async ({ code: dir }, { actor, abort }) => {
    return Promise.all([
      await CONFIG.get(await REDIS.get(`${actor}.room`)),
      Util.timeout(100),
    ]).then(([room]) => {
      const exit = room?.exits?.[dir];
      return exit ? { room, exit } : abort('No exit in that direction!');
    });
  },

  () => Util.timeout(250),

  async ({ room, exit }, context) => {
    const { actor } = context;
    await REDIS.set(`${actor}.room`, `${exit}`);
    CONFIG.get(`${room}.units`).delete(actor);
    CONFIG.get(`${exit}.units`).add(actor);
    room.leave?.(context);
    exit.enter?.(context);
  },
]);
