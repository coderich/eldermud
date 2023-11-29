import Chance from 'chance';

const chance = new Chance();

export default {
  'room.1': {
    id: 'room.1',
    name: 'Hallway, Start',
    description: chance.paragraph(),
    exits: { s: 'room.2' },
    items: ['item.1'],
    units: [],
    shop: 'shop.general',
    trainer: 'trainer.universal',
  },
  'room.2': {
    id: 'room.2',
    name: 'Hallway, Center',
    description: chance.paragraph(),
    exits: { w: 'room.4', n: 'room.1', s: { 'room.3': ['obstacle.1'] } },
    items: [],
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
      num: '1d3+1',
      templates: ['blueprint.ant', 'blueprint.rat', 'blueprint.cavebear'],
    },
  },
  'room.4': {
    id: 'room.4',
    name: 'Hallway, Cooridore',
    description: chance.paragraph(),
    exits: { w: 'room.5', e: 'room.2' },
    items: [],
    units: [],
    spawn: new Date().getTime(),
    respawn: '1d10000+10000',
    spawnlings: {
      num: 1,
      templates: ['blueprint.ant'],
    },
  },
  'room.5': {
    id: 'room.5',
    name: 'Hallway, Cooridore',
    description: chance.paragraph(),
    exits: { w: 'room.6', e: 'room.4' },
    items: [],
    units: [],
    spawn: new Date().getTime(),
    respawn: '1d10000+10000',
    spawnlings: {
      num: 1,
      templates: ['blueprint.ant'],
    },
  },
  'room.6': {
    id: 'room.6',
    name: 'Hallway, Bend',
    description: chance.paragraph(),
    exits: { s: 'room.7', e: 'room.5' },
    items: [],
    units: [],
    spawn: new Date().getTime(),
    respawn: '1d10000+10000',
    spawnlings: {
      num: 1,
      templates: ['blueprint.ant'],
    },
  },
  'room.7': {
    id: 'room.7',
    name: 'Hallway, Bend',
    description: chance.paragraph(),
    exits: { n: 'room.6', e: 'room.8' },
    items: [],
    units: [],
    spawn: new Date().getTime(),
    respawn: '1d10000+10000',
    spawnlings: {
      num: 1,
      templates: ['blueprint.ant'],
    },
  },
  'room.8': {
    id: 'room.8',
    name: 'Hallway, Cooridore',
    description: chance.paragraph(),
    exits: { w: 'room.7', e: 'room.9' },
    items: [],
    units: [],
    spawn: new Date().getTime(),
    respawn: '1d10000+10000',
    spawnlings: {
      num: 1,
      templates: ['blueprint.ant'],
    },
  },
  'room.9': {
    id: 'room.9',
    name: 'Hallway, End',
    description: chance.paragraph(),
    exits: { w: 'room.8' },
    items: ['item.1'],
    units: [],
    spawn: new Date().getTime(),
    respawn: '1d15000+20000',
    spawnlings: {
      num: '1d2+1',
      templates: ['blueprint.ant', 'blueprint.rat'],
    },
  },
  'obstacle.1': {
    id: 'obstacle.1',
    type: 'door',
    name: 'door',
    state: { open: false, locked: true },
  },
  // 'obstacle.10': {
  //   id: 10,
  //   type: 'compound',
  //   refs: [1],
  //   state: {},
  // },
};