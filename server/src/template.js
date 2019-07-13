export default {
  'creature.rat': {
    id: 'creature.rat',
    name: 'rat',
    dc: 1,
    ac: 8,
    hp: '2d4+2',
    exp: 1, // per hp?
    sizes: [
      ['small', 'wimpy', 'fragile', 'scrawny'],
      ['', 'angry'],
      [''],
    ],
    attacks: {
      'attack.bite': {
        lead: 1000,
        lag: 2500,
        dmg: '1d3',
        acc: '1d20',
      },
    },
    drops: {
      'item.idk': {
        pct: 10,
      },
    },
  },
  'attack.punch': {
    id: 'attack.punch',
    type: 'bludgeoning',
  },
  'attack.bite': {
    id: 'attack.bite',
    type: 'piercing',
  },
  'attack.sword': {
    id: 'attack.bite',
    type: 'slashing',
  },
};
