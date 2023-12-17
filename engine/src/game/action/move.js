const Util = require('@coderich/util');
const { Action } = require('@coderich/gameflow');

Action.define('move', [
  async ({ code: dir }, { actor, abort, promise }) => {
    // Exit check
    const room = await CONFIG.get(await REDIS.get(`${actor}.room`));
    const exit = room?.exits?.[dir];
    if (!exit) return abort('There is no exit in that direction!');

    // Door check
    const door = room.doors?.[dir];
    if (door) {
      promise.listen((step) => {
        if (door.status !== 'open') abort(`The door is ${door.status.toUpperCase()} in that direction!`);
      });
    }

    return { room, exit };
  },

  () => Util.timeout(250),

  async ({ room, exit }, context) => {
    const { actor } = context;
    await REDIS.set(`${actor}.room`, `${exit}`);
    CONFIG.get(`${room}.units`).delete(actor);
    CONFIG.get(`${exit}.units`).add(actor);
    actor.roomSearch.clear();
    actor.perform('map');
    actor.perform('room');
  },
]);
