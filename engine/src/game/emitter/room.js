const { Action } = require('@coderich/gameflow');

Action.define('room', [
  async (_, { actor }) => {
    const [m, r] = await Redis.mGet([`${actor}.map`, `${actor}.room`]);
    const room = Config.get(`${m}.rooms.${r}`);

    if (room) {
      const $room = {
        name: room.name,
        description: room.description,
        exits: Object.keys(room.exits),
        units: Array.from(room.units.values()).map(unit => ({ name: unit.username })),
      };

      actor.emit('room', $room);
    }
  },
]);
