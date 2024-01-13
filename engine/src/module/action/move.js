const Util = require('@coderich/util');
const { Action } = require('@coderich/gameflow');

Action.define('move', [
  async (dir, context) => {
    const { actor, abort, promise } = context;

    // Exit check
    const room = await CONFIG.get(await REDIS.get(`${actor}.room`));
    const exit = room?.exits?.[dir];
    if (!exit) return abort('There is no exit in that direction!');

    // Pathway check
    const path = room.paths?.[dir];
    if (path) {
      switch (path.type) {
        case 'door': {
          promise.listen((step) => {
            if (path.status !== 'open') abort(`The door is ${path.status} in that direction!`);
          });
          break;
        }
        default: {
          await path.check?.(context);
          break;
        }
      }
    }

    return { room, exit };
  },

  () => Util.timeout(1000),

  async ({ room, exit }, context) => {
    const { actor } = context;
    await REDIS.set(`${actor}.room`, `${exit}`);
    CONFIG.get(`${room}.units`).delete(actor);
    CONFIG.get(`${exit}.units`).add(actor);
    actor.roomSearch.clear();
    await actor.perform('map');
    await actor.perform('room', exit);
  },
]);
