const { Action } = require('@coderich/gameflow');

Action.define('move', [
  async ({ code }, context) => {
    const { actor, abort, promise } = context;

    // Exit check
    const exit = CONFIG.get(await actor.get('room'));
    const room = exit?.exits?.[code];
    if (!room) return abort('There is no exit in that direction!');

    // Pathway check
    const path = exit.paths?.[code];
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

    return { code, room, exit };
  },

  (_, { actor }) => APP.timeout(actor.moveSpeed),

  async ({ room, exit }, { actor }) => {
    // Leave
    await actor.save({ room });
    exit.units.delete(actor);
    room.units.add(actor);
    actor.$search.clear();
    actor.perform('map');
    await actor.perform('room', room);
  },
]);
