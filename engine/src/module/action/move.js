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

    return { dir, room, exit };
  },

  () => APP.timeout(1000),

  async ({ dir, room, exit }, context) => {
    const { actor } = context;

    // Leave
    const [map] = `${exit}`.split('.rooms');
    await actor.save({ room: exit, map });
    room.units.delete(actor);
    exit.units.add(actor);
    actor.$search.clear();
  },
]);
