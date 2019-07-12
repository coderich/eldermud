module.exports = {
  'user.1': {
    id: 'user.1',
    name: 'chardy',
    room: 'room.1',
    hp: 10,
    items: [],
  },
  'creature.1': {
    id: 'creature.1',
    name: 'rat',
    room: 'room.3',
    hp: 5,
  },
  'room.1': {
    id: 'room.1',
    name: 'Hallway, Start',
    description: 'People all come to gather, socialize, and have fun',
    exits: { s: 'room.2' },
  },
  'room.2': {
    id: 'room.2',
    name: 'Hallway, Center',
    description: 'The best damn goodies you ever saw',
    exits: { n: 'room.1', s: 'room.3' },
  },
  'room.3': {
    id: 'room.3',
    name: 'Hallway, End',
    description: 'Deposit money, make little interest',
    beings: ['creature.1'],
    exits: { n: 'room.2' },
  },
  'obstacle.1': {
    id: 'obstacle.1',
    type: 'door',
    name: 'door',
    state: { open: false, locked: true },
  },

  // 'room.1': {
  //   id: 'room.1',
  //   name: 'Hallway, Start',
  //   description: 'People all come to gather, socialize, and have fun',
  //   exits: { s: 2, e: { 100: [1] } },
  // },
  // 'obstacle.10': {
  //   id: 10,
  //   type: 'compound',
  //   refs: [1],
  //   state: {},
  // },
  // 'item.1': {
  //   id: 1,
  //   type: 'key',
  //   name: 'set of keys',
  //   description: 'A beautiful key',
  //   obstacles: [1],
  //   state: { hidden: true },
  // },
  // 'item.2': {
  //   id: 2,
  //   type: 'general',
  //   name: 'rope',
  //   description: 'A beautiful rope',
  //   obstacles: [2],
  //   state: { hidden: true },
  // },
  // 'item.3': {
  //   id: 3,
  //   type: 'general',
  //   name: 'water bottle',
  //   description: 'A beautiful water bottle',
  //   state: {},
  // },
  // 'storyline.1': {
  //   id: 1,
  //   repeat: 0,
  //   sequence: [
  //     { type: 'info', message: 'You come there' },
  //     {
  //       type: 'query',
  //       message: 'What now!?',
  //       response: {
  //       },
  //     },
  //   ],
  // },
};
