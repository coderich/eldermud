const $self = prop => '${self:map.test.'.concat(prop, '}');
const $room = prop => $self(`rooms.${prop}`);

module.exports = {
  name: 'Test',
  description: 'Used only for testing and should be ignored as content',

  rooms: {
    start: {
      name: 'start',
      exits: {
        n: $room('north'),
        s: $room('south'),
        e: $room('east'),
        w: $room('west'),
      },
    },
    north: {
      name: 'north',
      exits: { s: $room('start') },
    },
    south: {
      name: 'south',
      exits: { n: $room('start') },
    },
    east: {
      name: 'east',
      exits: { w: $room('start') },
    },
    west: {
      name: 'west',
      exits: { e: $room('start') },
    },
  },
};
