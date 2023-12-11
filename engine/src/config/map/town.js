const $self = prop => '${self:map.town.'.concat(prop, '}');
const $room = prop => $self(`rooms.${prop}`);

module.exports = {
  name: 'Town',

  rooms: {
    start: {
      name: 'Hallway, Start',
      exits: { s: $room('room2') },
    },
    room2: {
      name: 'Room2',
      exits: { n: $room('start') },
    },
  },
};
