export default {
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
};
