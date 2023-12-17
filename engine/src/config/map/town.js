const $self = prop => '${self:map.town.'.concat(prop, '}');
const $room = prop => $self(`rooms.${prop}`);

SYSTEM.on('enter:map.town.rooms.supplies', async ({ actor }) => {
  // actor.socket.emit('text', 'You gone done fucked up');
  // CONFIG.set('map.town.rooms.supplies.exits', {});
  delete CONFIG.get('map.town.rooms.tunnel2.exits').w;
  actor.perform('map');
});

SYSTEM.on('search:map.town.rooms.supplies', async ({ actor }) => {
  const items = [CONFIG.get('item.rope'), CONFIG.get('item.canteen')];
  actor.roomSearch = new Set(items);
  // const items = await APP.instantiate(['item.rope', 'item.canteen']);
  const descr = items.map(it => it.name).join(', ');
  return actor.socket.emit('text', `You notice ${descr} here.`);
});

module.exports = {
  name: 'Town',

  rooms: {
    start: {
      name: 'Cave, Start',
      exits: { s: $room('tunnel1') },
    },
    tunnel1: {
      name: 'Tunnel',
      exits: { n: $room('start'), s: $room('tunnel2') },
      doors: { s: '${self:door.wood}' },
    },
    tunnel2: {
      name: 'Tunnel',
      exits: { n: $room('tunnel1'), e: $room('blockade'), w: $room('supplies') },
      doors: { n: '${self:door.wood}' },
    },
    blockade: {
      name: 'Blockade',
      exits: { w: $room('tunnel2') },
    },
    supplies: {
      char: '$',
      name: 'Supplies',
      exits: { e: $room('tunnel2') },
    },
  },
};
