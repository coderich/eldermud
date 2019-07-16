export default {
  'blueprint.rat': {
    id: 'blueprint.rat',
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
    roams: false,
    follows: true,
  },
  'blueprint.cavebear': {
    id: 'blueprint.cavebear',
    name: 'cave bear',
    dc: 3,
    ac: 12,
    hp: 50,
    exp: 6, // per hp?
    spawn: new Date().getTime(),
    respawn: 60000, // 1 minute
    attacks: {
      'attack.bite': {
        lead: 1000,
        lag: 2500,
        dmg: '4d3',
        acc: '1d20',
      },
      'attack.claw': {
        lead: 1000,
        lag: 2000,
        dmg: '3d3',
        acc: '2d10',
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
  'attack.claw': {
    id: 'attack.claw',
    type: 'slashing',
  },
  'attack.sword': {
    id: 'attack.bite',
    type: 'slashing',
  },
};
