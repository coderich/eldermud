const { Action } = require('@coderich/gameflow');

Action.define('room', [
  async (room, { actor }) => {
    if (actor.type === 'player') {
      room ??= CONFIG.get(await actor.get('room'));

      const $loners = Array.from(room.units.values()).filter(unit => unit !== actor && unit.$party.size <= 1);
      const $groups = Array.from(new Set(Array.from(room.units.values()).filter(unit => unit.$party.size > 1).map(u => u.$party)));
      const $npcs = $loners.filter(el => el.type === 'npc').map(unit => APP.styleText(unit.type, unit.name));
      const $creatures = $loners.filter(el => el.type === 'creature').map(unit => APP.styleText(unit.type, unit.name));
      const $players = $loners.filter(el => el.type === 'player').map(unit => APP.styleText(unit.type, unit.name));
      const $units = [
        ...$npcs,
        ...$creatures,
        ...$groups.map(el => APP.to2DParty(Array.from(el))),
        ...$players,
      ].filter(Boolean);

      const $exits = Object.keys(room.exits || {}).map((dir) => {
        let text = APP.direction[dir];
        const path = CONFIG.get(`${room}.paths.${dir}`);
        if (path) text = `${path.label} ${text}`;
        return APP.styleText('room.exit', text);
      });

      const $room = {
        name: APP.styleText('room.name', room.name),
        description: APP.styleText('room.description', room.description),
        exitsLabel: APP.styleText('room.exitsLabel', 'Obvious exits:'),
        unitsLabel: APP.styleText('room.unitsLabel', 'Also here:'),
        items: Array.from(room.items.values()).filter(item => !item.hidden).map(item => item.name),
        exits: $exits.length ? $exits : [APP.styleText('room.exit', 'none!')],
        units: $units,
      };

      await actor.send('text', $room.name);
      await actor.send('text', $room.description);
      if ($room.items.length) await actor.send('text', APP.styleText('item', `You notice ${$room.items.join(', ')} here.`));
      if ($room.units.length) await actor.send('text', `${$room.unitsLabel} ${$room.units.join(', ')}`);
      await actor.send('text', `${$room.exitsLabel} ${$room.exits.join(', ')}`);
    }
  },
]);
