const { Action } = require('@coderich/gameflow');

Action.define('room', [
  async (_, { actor }) => {
    const room = CONFIG.get(await REDIS.get(`${actor}.room`));

    if (room) {
      const $exits = Object.keys(room.exits).map((dir) => {
        let text = APP.direction[dir];
        const door = room.doors?.[dir];
        if (door) text = `${door.status === 'open' ? 'open' : 'closed'} door ${text}`;
        return APP.styleText(text, 'room.exit');
      });

      const $items = await REDIS.sMembers(`${room}.items`).then(items => items.map(item => CONFIG.get(`${item}`)?.name).filter(Boolean));
      const $units = Array.from(room.units.values()).filter(unit => unit !== actor).map(unit => APP.styleText(unit.name, 'unit.name'));

      const $room = {
        name: APP.styleText(room.name, 'room.name'),
        description: APP.styleText(room.description, 'room.description'),
        exitsLabel: APP.styleText('Obvious exits: ', 'room.exitsLabel'),
        unitsLabel: APP.styleText('Also here: ', 'room.unitsLabel'),
        itemsLabel: APP.styleText('You notice: ', 'room.unitsLabel'),
        exits: $exits.length ? $exits : [APP.styleText('none!', 'room.exit')],
        units: $units,
        items: $items,
      };
      actor.socket.emit('room', $room);
    }
  },
]);
