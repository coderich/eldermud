export default {
  'attack.punch': {
    id: 'attack.punch',
    type: 'bludgeoning',
    dmg: '1d4',
    scale: {
      str: 0.10,
      agi: 0.07,
      int: 0.03,
    },
  },
  'attack.claw': {
    id: 'attack.claw',
    type: 'slashing',
    dmg: '1d6+1',
    scale: {
      str: 0.10,
      agi: 0.07,
      int: 0.03,
    },
  },
  'attack.bite': {
    id: 'attack.bite',
    type: 'piercing',
    dmg: '1d8+2',
    scale: {
      str: 0.10,
      agi: 0.07,
      int: 0.03,
    },
  },
};
