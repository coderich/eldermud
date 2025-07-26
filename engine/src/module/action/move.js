const { Action } = require('@coderich/gameflow');

Action.define('move', [
  async (dir, context) => {
    const { actor, abort, promise } = context;

    // Exit check
    const exit = CONFIG.get(await actor.get('room'));
    const room = exit?.exits?.[dir];
    if (!room) return abort('There is no exit in that direction!');

    // Pathway check
    const path = exit.paths?.[dir];
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

  async ({ dir, room, exit }, { actor }) => {
    // Leave
    await actor.save({ room });
    exit.units.delete(actor);
    room.units.add(actor);
    actor.$search.clear();
    actor.perform('map');
    await actor.perform('room', room);
  },
]);
