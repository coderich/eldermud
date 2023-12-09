const { Action } = require('@coderich/gameflow');

Action.define('room', [
  async (_, { actor }) => {
    const [m, r] = await REDIS.mGet([`${actor}.map`, `${actor}.room`]);
    const room = CONFIG.get(`${m}.rooms.${r}`);

    if (room) {
      const $room = {
        name: room.name,
        description: room.description,
        exits: Object.keys(room.exits),
        units: Array.from(room.units.values()).filter(u => true).map(unit => ({ name: unit.username })),
      };

      actor.socket.emit('room', $room);
    }
  },
]);
