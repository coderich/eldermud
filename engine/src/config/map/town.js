const $self = prop => '${self:map.town.'.concat(prop, '}');
const $room = prop => $self(`rooms.${prop}`);
const $door = prop => $self(`doors.${prop}`);
const $blockade = prop => $self(`blockade.${prop}`);

SYSTEM.on('enter:map.town.rooms.supplies', async ({ actor }) => {
  // actor.socket.emit('text', 'You gone done fucked up');
  CONFIG.set('map.town.rooms.supplies.paths', { e: $blockade('rubble') });
  actor.perform('map');
});

SYSTEM.on('search:map.town.rooms.supplies', async ({ actor }) => {
  const items = [CONFIG.get('item.rope'), CONFIG.get('item.canteen')];
  actor.roomSearch = new Set(items);
  const descr = items.map(it => it.name).join(', ');
  return actor.socket.emit('text', `You notice ${descr} here.`);
});

module.exports = {
  name: 'Town',

  doors: {
    wood: {
      name: 'Wooden Door',
      label: `${$door('wood.status')} door`,
      description: 'A door made of wood.',
      status: 'closed',
      durability: 100,
      picklock: 100,
      key: '${self:item.key.key1}',
    },
  },

  blockade: {
    rubble: {
      name: 'Rubble',
      label: 'pile of rubble',
      description: 'A pile of rubble.',
      check: async ({ actor, abort }) => {
        const inv = await REDIS.sMembers(`${actor}.inventory`).then(items => items.map(item => item.substring(0, item.lastIndexOf('.'))));
        if (!inv.includes('item.rope')) abort('You are unable to scale the rubble!');
        else actor.socket.emit('text', 'You scale the rubble with your rope & grapple.');
      },
    },
  },

  rooms: {
    start: {
      name: 'Cave, Start',
      exits: { s: $room('tunnel1') },
    },
    tunnel1: {
      name: 'Tunnel',
      exits: { n: $room('start'), s: $room('tunnel2') },
      paths: { s: $door('wood') },
    },
    tunnel2: {
      name: 'Tunnel',
      exits: { n: $room('tunnel1'), e: $room('blockade'), w: $room('supplies') },
      paths: { n: $door('wood') },
    },
    blockade: {
      name: 'Blockade',
      exits: { w: $room('tunnel2') },
      spawns: [
        { num: '1d2+1', units: ['${self:creature.ant}'] },
      ],
    },
    supplies: {
      char: '$',
      name: 'Supplies',
      exits: { e: $room('tunnel2') },
    },
  },
};
