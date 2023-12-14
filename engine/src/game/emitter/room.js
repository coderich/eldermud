const { Action } = require('@coderich/gameflow');

Action.define('room', [
  async (_, { actor }) => {
    const room = CONFIG.get(await REDIS.get(`${actor}.room`));

    if (room) {
      const $exits = Object.keys(room.exits).map(dir => APP.styleText(APP.direction[dir], 'room.exit'));
      const $units = Array.from(room.units.values()).filter(unit => unit !== actor).map(unit => APP.styleText(unit.name, 'unit.name'));
      const $room = {
        name: APP.styleText(room.name, 'room.name'),
        description: APP.styleText(room.description, 'room.description'),
        exitsLabel: APP.styleText('Obvious exits: ', 'room.exitsLabel'),
        unitsLabel: APP.styleText('Also here: ', 'room.unitsLabel'),
        exits: $exits.length ? $exits : [APP.styleText('none!', 'room.exit')],
        units: $units,
      };
      actor.socket.emit('room', $room);
    }
  },
]);
