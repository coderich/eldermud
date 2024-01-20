const { Action } = require('@coderich/gameflow');

Action.define('room', [
  async (room, { actor }) => {
    const includeParty = !room;

    room ??= CONFIG.get(await REDIS.get(`${actor}.room`));

    const $exits = Object.keys(room.exits).map((dir) => {
      let text = APP.direction[dir];
      const path = CONFIG.get(`${room}.paths.${dir}`);
      if (path) text = `${path.label} ${text}`;
      return APP.styleText('room.exit', text);
    });

    const $units = Array.from(room.units.values()).filter(unit => unit !== actor && !actor.$party.has(unit)).map(unit => APP.styleText(unit.type, unit.name));
    const $items = Array.from(room.items.values()).filter(item => !item.hidden).map(item => item.name);
    const $party = [actor].concat(Array.from(actor.$party.values()));
    const $2dParty = [
      $party.filter(unit => unit.$partyRank === 1).map(unit => APP.styleText(unit.type, unit.name)).join(', '),
      $party.filter(unit => unit.$partyRank === 2).map(unit => APP.styleText(unit.type, unit.name)).join(', '),
      $party.filter(unit => unit.$partyRank === 3).map(unit => APP.styleText(unit.type, unit.name)).join(', '),
    ].reduce((prev, units, index) => {
      if (index === 0) return prev.concat(units).concat(units.length ? ' >' : '');
      if (index === 1) return prev.concat(units.length ? ' ' : '>').concat(units);
      return prev.concat(units.length ? ' ' : '').concat(units);
    }, '');

    const $room = {
      name: APP.styleText('room.name', room.name),
      description: APP.styleText('room.description', `    ${room.description}`),
      exitsLabel: APP.styleText('room.exitsLabel', 'Obvious exits:'),
      unitsLabel: APP.styleText('room.unitsLabel', 'Also here:'),
      partyLabel: APP.styleText('room.partyLabel', 'Party:'),
      exits: $exits.length ? $exits : [APP.styleText('room.exit', 'none!')],
      units: $units,
      items: $items,
      party: $2dParty,
    };

    // $room.units.push('[Random >> Zilo, Bane]');
    // $room.units.push('[Paul > Alfred > Crimp]');
    // $room.units.push('[Tom, Jerry > Henry]');
    actor.send('text', $room.name);
    // actor.send('text', $room.description);
    if ($room.items.length) actor.send('text', APP.styleText('item', `You notice ${$room.items.join(', ')} here.`));
    if (includeParty && $party.length > 1) actor.send('text', $room.partyLabel, `[${$room.party}]`);
    if ($room.units.length) actor.send('text', `${$room.unitsLabel} ${$room.units.join(', ')}`);
    actor.send('text', `${$room.exitsLabel} ${$room.exits.join(', ')}`);
  },
]);
