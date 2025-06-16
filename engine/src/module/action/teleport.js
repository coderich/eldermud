const { Action } = require('@coderich/gameflow');

Action.define('teleport', [
  async ({ map, room }, { actor }) => {
    room = await CONFIG.get(`${room}`);
    const exit = actor.room;
    await actor.save({ map, room });
    room.units.delete(actor);
    exit.units.add(actor);
    await actor.send('cls');
    await actor.perform('map');
    await actor.perform('room');
    return { map, room, exit: actor.room };
  },
]);
