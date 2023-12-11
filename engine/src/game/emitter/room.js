const { Action } = require('@coderich/gameflow');

Action.define('room', [
  async (_, { actor }) => {
    const room = CONFIG.get(await REDIS.get(`${actor}.room`));

    if (room) {
      const $room = {
        name: room.name,
        description: room.description,
        exits: Object.keys(room.exits),
        units: Array.from(room.units.values()).filter(unit => unit !== actor).map(unit => ({ name: unit.name })),
      };

      actor.socket.emit('room', $room);
    }
  },
]);
