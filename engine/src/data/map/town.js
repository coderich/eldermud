const $self = prop => '${self:map.town.'.concat(prop, '}');
const $room = prop => $self(`rooms.${prop}`);

SYSTEM.on('enter:map.town.rooms.supplies', async ({ actor }) => {
  CONFIG.set('map.town.rooms.supplies.paths', { e: '${self:blockade.rubble}' });
  actor.perform('map');
});

SYSTEM.on('post:spawn', async ({ actor }) => {
  if (actor.type === 'player') {
    const room = 'map.town.rooms.supplies';
    const isNew = await REDIS.sAdd(`${room}.players`, `${actor}`);

    if (isNew) {
      await APP.instantiate([CONFIG.get('item.rope'), CONFIG.get('item.canteen')], { room, hidden: true, owner: `${actor}` }).then((items) => {
        return Promise.all(items.map(item => item.perform('spawn')));
      });
    }
  }
});

module.exports = {
  name: 'Town',
  description: 'A small town used for internal game-play walkthrough',
  rooms: {
    start: {
      name: 'Cave, Start',
      exits: { s: $room('tunnel1') },
    },
    tunnel1: {
      name: 'Tunnel',
      exits: { n: $room('start'), s: $room('tunnel2') },
      paths: { s: '${self:door.wood}' },
    },
    tunnel2: {
      name: 'Silver Street',
      description: 'This is a cobblestoned street. It is dimly lit by guttering lanterns hung from tall posts. To the north, a dimly lit shop stands, the sign over the door reading "Curious Goods" in a spidery script. A large, gaily decorated shop to the south sports a yellow awning. Its brightly painted sign reads "General Store". Quite a few people mill about here, entering the shops or heading west toward the town square. Silver streets heads off to the east and west here',
      exits: { n: $room('tunnel1'), e: $room('blockade'), w: $room('supplies') },
      paths: { n: '${self:door.wood}' },
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
      shop: '${self:shop.general}',
      exits: { e: $room('tunnel2') },
    },
  },
};
