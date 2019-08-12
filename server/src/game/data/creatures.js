export default {
  'blueprint.ant': {
    id: 'blueprint.ant',
    name: 'ant',
    dc: 1,
    ac: 5,
    hp: 3,
    exp: 1,
    adjectives: ['', 'small', 'giant', 'huge', 'fat', 'skinny'],
    moves: ['creep', 'scuttle'],
    attacks: [
      {
        dmg: '1d2',
        acc: '1d20-5',
        spd: 1000,
        type: 'P',
        hits: ['nibble', 'bite', 'chomp'],
        misses: ['lunge'],
      },
    ],
    roams: false,
    follows: true,
  },
  'blueprint.rat': {
    id: 'blueprint.rat',
    name: 'rat',
    dc: 1,
    ac: 8,
    hp: 9,
    exp: 1, // per hp?
    adjectives: ['', 'small', 'giant', 'huge', 'fat', 'skinny', 'angry'],
    moves: ['creep', 'scuttle', 'sneak', 'ooze'],
    attacks: [
      {
        dmg: '1d3',
        acc: '1d20',
        spd: 1000,
        type: 'P',
        hits: ['claw', 'scratch'],
        misses: ['swipe'],
      },
      {
        dmg: '1d6+1',
        acc: '1d20',
        spd: 1000,
        type: 'P',
        hits: ['gnaw', 'bite', 'chomp'],
        misses: ['snap', 'lunge'],
      },
    ],
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
    adjectives: ['', 'angry', 'fierce'],
    moves: ['stomp', 'leap'],
    attacks: [
      {
        dmg: '2d4+1',
        acc: '2d10',
        spd: 1000,
        type: 'P',
        hits: ['claw', 'tear'],
        misses: ['swipe'],
      },
      {
        dmg: '2d8+2',
        acc: '2d10',
        spd: 1000,
        type: 'P',
        hits: ['gnaw', 'bite', 'chomp'],
        misses: ['snap', 'lunge'],
      },
    ],
    drops: {
      'item.idk': {
        pct: 10,
      },
    },
  },
};
