export default {
  'object.rope': {
    id: 'object.rope',
    name: 'Rope',
    type: 'general',
    cost: 30,
  },
  'object.dagger': {
    id: 'object.dagger',
    name: 'Dagger',
    type: 'weapon',
    cost: 40,
    attack: {
      type: 'piercing',
      dmg: '1d6',
      mod: {
        str: 0.10,
        agi: 0.07,
        int: 0.03,
      },
    },
  },
  'object.shortsword': {
    id: 'object.shortsword',
    name: 'ShortSword',
    type: 'weapon',
    cost: 100,
    attack: {
      type: 'piercing',
      dmg: '1d8+3',
      mod: {
        str: 0.10,
        agi: 0.07,
        int: 0.03,
      },
    },
  },
};
