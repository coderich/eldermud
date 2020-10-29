export default {
  'room.1': {
    id: 'room.1',
    name: 'Firebend, Town Gates',
    description: '',
    exits: { n: 'room.2', s: { 'room.out': ['obstacle.southGate'] } },
    items: [],
    units: ['npc.cityGuard'],
  },
  'room.2': {
    id: 'room.2',
    name: 'Firebend, Dirt Pathway',
    description: '',
    exits: { s: 'room.1', n: 'room.market1', e: 'room.se1', w: 'room.sw1' },
    items: [],
    units: [],
  },
  'room.market1': {
    id: 'room.market1',
    name: 'Firebend, Marketplace',
    description: '',
    exits: { s: 'room.2', w: 'room.weapons', e: 'room.trainer', n: 'room.market2' },
    depth: 2,
    items: [],
    units: [],
  },
  'room.weapons': {
    id: 'room.weapons',
    name: 'Firebend, Weapons Shop',
    description: '',
    exits: { e: 'room.market1' },
    depth: 2,
    shop: 'shop.weapon',
    items: [],
    units: [],
  },
  'room.trainer': {
    id: 'room.trainer',
    name: 'Firebend, Trainer',
    description: '',
    exits: { w: 'room.market1' },
    depth: 2,
    items: [],
    units: [],
  },
  'room.market2': {
    id: 'room.market2',
    name: 'Firebend, Marketplace',
    description: '',
    exits: { s: 'room.market1', w: 'room.general', e: 'room.mystic', n: 'room.market3' },
    depth: 2,
    items: [],
    units: [],
  },
  'room.general': {
    id: 'room.general',
    name: 'Firebend, General Shop',
    description: '',
    exits: { e: 'room.market2' },
    depth: 2,
    shop: 'shop.general',
    items: [],
    units: [],
  },
  'room.mystic': {
    id: 'room.mystic',
    name: 'Firebend, Mystic',
    description: '',
    exits: { w: 'room.market2' },
    depth: 2,
    items: [],
    units: [],
  },
  'room.market3': {
    id: 'room.market3',
    name: 'Firebend, Marketplace',
    description: '',
    exits: { s: 'room.market2', w: 'room.magic', e: 'room.quest', n: 'room.courtyard1' },
    depth: 2,
    items: [],
    units: [],
  },
  'room.magic': {
    id: 'room.magic',
    name: 'Firebend, Magic Shop',
    description: '',
    exits: { e: 'room.market3' },
    depth: 2,
    shop: 'shop.magic',
    items: [],
    units: [],
  },
  'room.quest': {
    id: 'room.quest',
    name: 'Firebend, Quest',
    description: '',
    exits: { w: 'room.market3' },
    depth: 2,
    items: [],
    units: [],
  },
  'room.courtyard1': {
    id: 'room.courtyard1',
    name: 'Firebend, Courtyard',
    description: '',
    exits: { s: 'room.market3', w: 'room.nw4' },
    items: [],
    units: [],
  },
  'room.se1': {
    id: 'room.se1',
    name: 'Firebend, Dirt Pathway',
    description: '',
    exits: { w: 'room.2' },
    items: [],
    units: ['npc.oldMan'],
  },
  'room.sw1': {
    id: 'room.sw1',
    name: 'Firebend, Dirt Pathway',
    description: '',
    exits: { e: 'room.2', w: 'room.sw2' },
    items: [],
    units: [],
  },
  'room.sw2': {
    id: 'room.sw2',
    name: 'Firebend, Dirt Pathway',
    description: '',
    exits: { e: 'room.sw1', w: 'room.sw3' },
    items: [],
    units: [],
  },
  'room.sw3': {
    id: 'room.sw3',
    name: 'Firebend, Dirt Pathway',
    description: '',
    exits: { e: 'room.sw2', w: 'room.sw4' },
    items: [],
    units: [],
  },
  'room.sw4': {
    id: 'room.sw4',
    name: 'Firebend, Dirt Pathway',
    description: '',
    exits: { e: 'room.sw3', n: 'room.w1' },
    items: [],
    units: [],
  },
  'room.w1': {
    id: 'room.w1',
    name: 'Firebend, Dirt Pathway',
    description: '',
    exits: { s: 'room.sw4', n: 'room.w2' },
    items: [],
    units: [],
  },
  'room.w2': {
    id: 'room.w2',
    name: 'Firebend, Dirt Pathway',
    description: '',
    exits: { s: 'room.w1', n: 'room.w3', e: { 'room.arenaW1': ['obstacle.arenaGate'] } },
    items: [],
    units: [],
  },
  'room.w3': {
    id: 'room.w3',
    name: 'Firebend, Dirt Pathway',
    description: '',
    exits: { s: 'room.w2', n: 'room.nw1' },
    items: [],
    units: [],
  },
  'room.nw1': {
    id: 'room.nw1',
    name: 'Firebend, Dirt Pathway',
    description: '',
    exits: { s: 'room.w3', e: 'room.nw2' },
    items: [],
    units: [],
  },
  'room.nw2': {
    id: 'room.nw2',
    name: 'Firebend, Dirt Pathway',
    description: '',
    exits: { w: 'room.nw1', e: 'room.nw3' },
    items: [],
    units: [],
  },
  'room.nw3': {
    id: 'room.nw3',
    name: 'Firebend, Dirt Pathway',
    description: '',
    exits: { w: 'room.nw2', e: 'room.nw4' },
    items: [],
    units: [],
  },
  'room.nw4': {
    id: 'room.nw4',
    name: 'Firebend, Dirt Pathway',
    description: '',
    exits: { w: 'room.nw3', e: 'room.courtyard1' },
    items: [],
    units: [],
  },
  'room.out': {
    id: 'room.out',
    name: '',
    description: '',
    exits: { s: 'room.out2' },
    items: [],
    units: [],
  },
  'room.out2': {
    id: 'room.out2',
    name: '',
    description: '',
    exits: { s: 'room.out3' },
    items: [],
    units: [],
  },
  'room.out3': {
    id: 'room.out3',
    name: '',
    description: '',
    exits: {},
    items: [],
    units: [],
  },
  'room.arenaW1': {
    id: 'room.arenaW1',
    name: '',
    description: '',
    exits: { w: { 'room.w2': ['obstacle.arenaGate'] }, ne: 'room.arenaNW1', se: 'room.arenaSW1' },
    fov: 'arena',
    items: [],
    units: [],
  },
  'room.arenaNW1': {
    id: 'room.arenaNW1',
    name: '',
    description: '',
    exits: { sw: 'room.arenaW1', e: 'room.arenaNW2' },
    fov: 'arena',
    items: [],
    units: [],
    spawn: Date.now(),
    respawn: '1d5000+1000',
    spawnlings: {
      num: '1d2',
      templates: ['blueprint.ant'],
    },
  },
  'room.arenaNW2': {
    id: 'room.arenaNW2',
    name: '',
    description: '',
    exits: { w: 'room.arenaW1', s: 'room.arenaW2' },
    fov: 'arena',
    items: [],
    units: [],
    spawn: Date.now(),
    respawn: '1d5000+1000',
    spawnlings: {
      num: '1d2',
      templates: ['blueprint.ant', 'blueprint.rat'],
    },
  },
  'room.arenaSW1': {
    id: 'room.arenaSW1',
    name: '',
    description: '',
    exits: { nw: 'room.arenaW1', e: 'room.arenaSW2' },
    fov: 'arena',
    items: [],
    units: [],
    spawn: Date.now(),
    respawn: '1d5000+1000',
    spawnlings: {
      num: '1d2',
      templates: ['blueprint.ant'],
    },
  },
  'room.arenaSW2': {
    id: 'room.arenaSW2',
    name: '',
    description: '',
    exits: { w: 'room.arenaSW1', n: 'room.arenaW2' },
    fov: 'arena',
    items: [],
    units: [],
    spawn: Date.now(),
    respawn: '1d5000+1000',
    spawnlings: {
      num: '1d2',
      templates: ['blueprint.ant', 'blueprint.rat'],
    },
  },
  'room.arenaW2': {
    id: 'room.arenaW2',
    name: '',
    description: '',
    exits: { s: 'room.arenaSW2', n: 'room.arenaNW2' },
    fov: 'arena',
    items: [],
    units: [],
    spawn: new Date().getTime(),
    respawn: '1d5000+1000',
    spawnlings: {
      num: '1d2',
      templates: ['blueprint.ant', 'blueprint.rat', 'blueprint.cavebear'],
    },
  },
  'obstacle.southGate': {
    id: 'obstacle.southGate',
    type: 'door',
    name: 'door',
    state: { open: false, locked: true },
  },
  'obstacle.arenaGate': {
    id: 'obstacle.arenaGate',
    type: 'door',
    name: 'door',
    state: { open: false },
  },
};
