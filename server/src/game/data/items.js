export default {
  'object.rope': {
    id: 'object.rope',
    name: 'rope',
    type: 'general',
    cost: 30,
  },
  'object.healthpotion': {
    id: 'object.healthpotion',
    name: 'health potion',
    type: 'potion',
    cost: 30,
    effects: [
      { effect: 'increase-health', roll: '1d10+5', duration: 1 },
    ],
  },
  'object.manapotion': {
    id: 'object.manapotion',
    name: 'mana potion',
    type: 'potion',
    cost: 50,
    effects: [
      { effect: 'increase-mana', roll: '1d10+5', duration: 1 },
    ],
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
      acc: '3d5+5',
      dmg: '1d6+1',
      hits: ['stab', 'spike'],
      misses: ['lunge', 'swipe'],
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
      dmg: '1d10+3',
      acc: '3d5+5',
      hits: ['thrust', 'slash'],
      misses: ['lunge', 'swing'],
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
      prot: 1,
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
      prot: 4,
    },
  },
};
