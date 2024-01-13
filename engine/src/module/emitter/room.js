const { Action } = require('@coderich/gameflow');

Action.define('room', [
  async (room, { actor }) => {
    room ??= CONFIG.get(await REDIS.get(`${actor}.room`));

    const $exits = Object.keys(room.exits).map((dir) => {
      let text = APP.direction[dir];
      const path = CONFIG.get(`${room}.paths.${dir}`);
      if (path) text = `${path.label} ${text}`;
      return APP.styleText('room.exit', text);
    });

    const $units = Array.from(room.units.values()).filter(unit => unit !== actor).map(unit => APP.styleText(unit.type, unit.name));
    const $items = Array.from(room.items.values()).filter(item => !item.hidden).map(item => item.name);

    const $room = {
      name: APP.styleText('room.name', room.name),
      description: APP.styleText('room.description', `    ${room.description}`),
      exitsLabel: APP.styleText('room.exitsLabel', 'Obvious exits:'),
      unitsLabel: APP.styleText('room.unitsLabel', 'Also here:'),
      exits: $exits.length ? $exits : [APP.styleText('room.exit', 'none!')],
      units: $units,
      items: $items,
    };

    actor.send('text', $room.name);
    actor.send('text', $room.description);
    if ($room.items.length) actor.send('text', APP.styleText('item', `You notice ${$room.items.join(', ')} here.`));
    if ($room.units.length) {
      // $room.units.push('[Random >> Zilo, Bane]');
      // $room.units.push('[Paul > Alfred > Crimp]');
      // $room.units.push('[Tom, Jerry > Henry]');
      actor.send('text', `${$room.unitsLabel} ${$room.units.join(', ')}`);
    }
    actor.send('text', `${$room.exitsLabel} ${$room.exits.join(', ')}`);
  },
]);
