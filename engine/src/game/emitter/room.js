const { Action } = require('@coderich/gameflow');

Action.define('room', [
  async (_, { actor }) => {
    const room = CONFIG.get(await REDIS.get(`${actor}.room`));

    if (room) {
      // const $room = {
      //   name: APP.styleText(room.name, 'room.name'),
      //   description: APP.styleText(room.description, 'room.description'),
      //   exits: Object.keys(room.exits),
      //   units: Array.from(room.units.values()).filter(unit => unit !== actor).map(unit => ({ name: unit.name })),
      // };

      const exits = Object.keys(room.exits);
      const alsoHere = Array.from(room.units.values()).filter(unit => unit !== actor).map(unit => ({ name: unit.name }));

      // actor.socket.emit('room', $room);
      actor.socket.emit('text', ''.concat(
        APP.styleText(room.name, 'room.name'),
        // '\n',
        // APP.styleText(room.description, 'room.description'),
        alsoHere ? APP.styleText('\nAlso here: ', 'room.here').concat(alsoHere.map((unit) => {
          return APP.styleText(unit.name, 'unit.name');
        }).join(', ')) : '',
        exits ? APP.styleText('\nObvious exits: ', 'room.exits').concat(exits.map((dir) => {
          return APP.styleText(APP.direction[dir], 'room.exit');
        }).join(', ')) : '',
      ));
    }
  },
]);
