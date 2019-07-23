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
  'room.1': {
    id: 'room.1',
    name: 'Hallway, Start',
    description: chance.paragraph(),
    exits: { s: 'room.2' },
    items: ['item.1'],
    units: [],
  },
  'room.2': {
    id: 'room.2',
    name: 'Hallway, Center',
    description: chance.paragraph(),
    exits: { w: 'room.4', n: 'room.1', s: { 'room.3': ['obstacle.1'] } },
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
    respawn: '1d5000+1000',
    spawnlings: {
      num: '1d2+1',
      blueprints: ['blueprint.rat', 'blueprint.cavebear'],
    },
  },
  'room.4': {
    id: 'room.4',
    name: 'Hallway, Cooridore',
    description: chance.paragraph(),
    exits: { w: 'room.5', e: 'room.2' },
    items: [],
    units: [],
  },
  'room.5': {
    id: 'room.5',
    name: 'Hallway, Cooridore',
    description: chance.paragraph(),
    exits: { w: 'room.6', e: 'room.4' },
    items: [],
    units: [],
  },
  'room.6': {
    id: 'room.6',
    name: 'Hallway, Corner',
    description: chance.paragraph(),
    exits: { e: 'room.5' },
    items: [],
    units: [],
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
