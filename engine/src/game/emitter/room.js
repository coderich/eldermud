const { Action } = require('@coderich/gameflow');

Action.define('room', [
  async (room, { actor }) => {
    room ??= CONFIG.get(await REDIS.get(`${actor}.room`));

    const $exits = Object.keys(room.exits).map((dir) => {
      let text = APP.direction[dir];
      const path = CONFIG.get(`${room}.paths.${dir}`);
      if (path) text = `${path.label} ${text}`;
      return APP.styleText(text, 'room.exit');
    });

    const $units = Array.from(room.units.values()).filter(unit => unit !== actor).map(unit => APP.styleText(unit.name, unit.type));
    const $items = Array.from(room.items.values()).filter(item => !item.hidden).map(item => item.name);

    const $room = {
      name: APP.styleText(room.name, 'room.name'),
      description: APP.styleText(`    ${room.description}`, 'room.description'),
      exitsLabel: APP.styleText('Obvious exits:', 'room.exitsLabel'),
      unitsLabel: APP.styleText('Also here:', 'room.unitsLabel'),
      exits: $exits.length ? $exits : [APP.styleText('none!', 'room.exit')],
      units: $units,
      items: $items,
    };

    actor.send('text', $room.name);
    actor.send('text', $room.description);
    if ($room.items.length) actor.send('text', APP.styleText(`You notice ${$room.items.join(', ')} here.`, 'item'));
    if ($room.units.length) {
      // $room.units.push('[Random >> Zilo, Bane]');
      // $room.units.push('[Paul > Alfred > Crimp]');
      // $room.units.push('[Tom, Jerry > Henry]');
      actor.send('text', `${$room.unitsLabel} ${$room.units.join(', ')}`);
    }
    actor.send('text', `${$room.exitsLabel} ${$room.exits.join(', ')}`);
  },
]);
