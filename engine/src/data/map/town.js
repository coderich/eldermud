const Item = require('../../model/Item');

const $self = prop => '${self:map.town.'.concat(prop, '}');
const $room = prop => $self(`rooms.${prop}`);
const $door = prop => $self(`doors.${prop}`);
const $blockade = prop => $self(`blockade.${prop}`);

SYSTEM.on('enter:map.town.rooms.supplies', async ({ actor }) => {
  CONFIG.set('map.town.rooms.supplies.paths', { e: $blockade('rubble') });
  actor.perform('map');
});

SYSTEM.on('post:spawn', async ({ actor }) => {
  if (actor.type === 'player') {
    const room = 'map.town.rooms.supplies';
    const isNew = await REDIS.sAdd(`${room}.players`, `${actor}`);

    if (isNew) {
      await APP.instantiate(CONFIG.get('item.rope'), CONFIG.get('item.canteen')).then((items) => {
        return Promise.all(items.map((item) => {
          return new Item({ ...item, room, hidden: true, owner: `${actor}` }).perform('spawn');
        }));
      });
    }
  }
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
        else actor.send('text', 'You scale the rubble with your rope & grapple.');
      },
    },
  },

  shops: {
    general: {
      items: ['${self:item.rope}', '${self:item.canteen}'],
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
      respawn: '1d5000+1000',
      spawns: [
        { num: '1d2+1', units: ['${self:creature.rat}'] },
      ],
    },
    supplies: {
      char: '$',
      name: 'Supplies',
      shop: $self('shops.general'),
      exits: { e: $room('tunnel2') },
    },
  },
};
