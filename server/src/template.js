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
  // 'talent.rage': {
  //   id: 'talent.rage',
  //   name: 'rage',
  //   code: 'rage',
  //   cost: 100,
  //   cd: 20,
  //   type: 'instant',
  //   target: 'self',
  //   effects: [
  //     { type: 'heal', roll: 1, element: 'pure', duration: 10 },
  //     { type: 'buff-damage', roll: 1, element: 'pure', duration: 10 },
  //   ],
  // },
  // 'talent.mihe': {
  //   id: 'talent.mihe',
  //   name: 'minor healing',
  //   code: 'mihe',
  //   cost: 10,
  //   cd: 0,
  //   type: 'instant',
  //   target: 'unit',
  //   effects: [
  //     { type: 'heal', roll: '3d3+3', element: 'pure', duration: 1 },
  //   ],
  // },
  // 'talent.mmis': {
  //   id: 'talent.mmis',
  //   name: 'magic missile',
  //   code: 'mmis',
  //   cost: 10,
  //   cd: 0,
  //   type: 'combat',
  //   target: 'unit',
  //   effect: [
  //     { type: 'harm', roll: '3d3+3', element: 'magic', duration: 1 },
  //   ],
  // },
  // 'talent.stom': {
  //   id: 'talent.stom',
  //   name: 'stomp',
  //   code: 'stom',
  //   cost: 50,
  //   cd: 10,
  //   type: 'instance',
  //   target: 'room',
  //   effect: [
  //     { type: 'harm', roll: '3d3+3', element: 'physical', duration: 1 },
  //     { type: 'stun', element: 'pure', duration: 1 },
  //   ],
  // },
  // 'talent.dble': {
  //   id: 'talent.dble',
  //   name: 'double edge',
  //   code: 'dble',
  //   cost: 50,
  //   cd: 10,
  //   type: 'instance',
  //   target: 'unit',
  //   effect: [
  //     { type: 'harm', target: 'target', roll: '3d3+3', element: 'physical', duration: 1 },
  //     { type: 'harm', target: 'self', roll: '3d3+3', element: 'physical', duration: 1 },
  //   ],
  // },
};
