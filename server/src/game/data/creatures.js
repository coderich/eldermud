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
        dmg: '4d3',
        acc: '1d20',
      },
      'attack.claw': {
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
};
