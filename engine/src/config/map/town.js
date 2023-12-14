const $self = prop => '${self:map.town.'.concat(prop, '}');
const $room = prop => $self(`rooms.${prop}`);

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
    },
    tunnel2: {
      name: 'Tunnel',
      exits: { n: $room('tunnel1'), e: $room('blockade'), w: $room('supplies') },
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
