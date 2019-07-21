import Chance from 'chance';

const chance = new Chance();

export default {
  'user.1': {
    id: 'user.1',
    name: 'chardy',
    room: 'room.1',
    hp: 25,
    mhp: 30,
    items: [],
  },
  'creature.1': {
    template: 'blueprint.rat',
    id: 'creature.1',
    room: 'room.1',
    name: 'rat',
    dc: 1,
    ac: 8,
    hp: 10,
    exp: 10,
    attacks: {
      'attack.bite': {
        dmg: '1d3',
        acc: '1d20',
      },
    },
  },
  'room.1': {
    id: 'room.1',
    name: 'Hallway, Start',
    description: chance.paragraph(),
    exits: { s: 'room.2' },
    items: ['item.1'],
    units: ['creature.1'],
  },
  'room.2': {
    id: 'room.2',
    name: 'Hallway, Center',
    description: chance.paragraph(),
    exits: { n: 'room.1', s: { 'room.3': ['obstacle.1'] } },
    items: ['item.2', 'item.3'],
    units: [],
  },
  'room.3': {
    id: 'room.3',
    name: 'Hallway, End',
    description: chance.paragraph(),
    exits: { n: 'room.2' },
    items: [],
    units: [],
    spawn: new Date().getTime(),
    respawn: 10000,
    spawnlings: {
      num: '1d2+1',
      blueprints: ['blueprint.rat', 'blueprint.cavebear'],
    },
  },
  'obstacle.1': {
    id: 'obstacle.1',
    type: 'door',
    name: 'door',
    state: { open: true, locked: false },
  },
  // 'obstacle.10': {
  //   id: 10,
  //   type: 'compound',
  //   refs: [1],
  //   state: {},
  // },
  'item.1': {
    id: 'item.1',
    type: 'key',
    name: 'set of keys',
    description: 'A beautiful key',
    obstacles: ['obstacle.1'],
    state: { hidden: true },
  },
  'item.2': {
    id: 'item.2',
    type: 'general',
    name: 'rope',
    description: 'A beautiful rope',
    state: {},
  },
  'item.3': {
    id: 'item.3',
    type: 'general',
    name: 'water bottle',
    description: 'A beautiful water bottle',
    state: {},
  },
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
