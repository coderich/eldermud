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

    // Broadcast to room that you left
    actor.broadcast('text', `${APP.styleText('highlight', actor.name)} just left to the ${APP.direction[dir]}.`);

    // Leave
    await actor.save({ room: exit });
    room.units.delete(actor);
    exit.units.add(actor);
    actor.$search.clear();
    actor.perform('map');
    actor.perform('room', exit);

    // Broadcast to room that you have arrived
    actor.broadcast('text', `${APP.styleText('highlight', actor.name)} moves into the room from the ${APP.rdirection[dir]}.`);

    // Notify those around you (except for room you just came from)
    Object.entries(exit.exits).filter(([d, x]) => x !== room).forEach(([d, x]) => {
      x.units?.forEach(unit => unit.send('text', APP.styleText('noise', `You hear movement to the ${APP.rdirection[d]}.`)));
    });
  },
]);
