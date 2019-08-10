export default {
  'object.rope': {
    id: 'object.rope',
    name: 'rope',
    type: 'general',
    cost: 30,
  },
  'object.dagger': {
    id: 'object.dagger',
    name: 'dagger',
    type: 'weapon',
    location: 'hand',
    handed: 1,
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
    name: 'shortsword',
    type: 'weapon',
    location: 'hand',
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
  'object.skullcap': {
    id: 'object.skullcap',
    name: 'skullcap',
    type: 'armor',
    location: 'head',
    cost: 50,
    defense: {
      type: 'cloth',
      toughness: 1,
    },
  },
  'object.shield': {
    id: 'object.shield',
    name: 'shield',
    type: 'armor',
    location: 'off-hand',
    cost: 500,
    defense: {
      type: 'iron',
      toughness: 4,
    },
  },
};
