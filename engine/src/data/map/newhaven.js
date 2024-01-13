const $self = prop => '${self:map.newhaven.'.concat(prop, '}');
const $room = prop => $self(`rooms.${prop}`);

module.exports = {
  name: 'New Haven',

  rooms: {
    start: {
      name: 'Crossroads',
      exits: { n: $room('knight'), s: $room('necro'), e: $room('robber'), w: $room('assassin') },
    },
    knight: {
      name: 'Death Knight',
      description: '${self:class.deathknight.description}',
      exits: { s: $room('start') },
    },
    necro: {
      name: 'Necromancer',
      description: '${self:class.necromancer.description}',
      exits: { n: $room('start') },
    },
    robber: {
      name: 'Grave Robber',
      description: '${self:class.graverobber.description}',
      exits: { w: $room('start') },
    },
    assassin: {
      // char: '$',
      name: 'Assassin',
      description: '${self:class.assassin.description}',
      exits: { e: $room('start') },
    },
  },
};
