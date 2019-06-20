module.exports = {
  'user.1': {
    id: 1,
    room: 1,
    name: 'chardy',
  },
  'room.1': {
    id: 1,
    name: 'Town Square',
    description: 'People all come to gather, socialize, and have fun',
    exits: { n: 2, s: 3, e: 4, w: 5 },
  },
  'room.2': {
    id: 2,
    name: 'Bakery Shop',
    description: 'The best damn goodies you ever saw',
    exits: { s: 1 },
  },
  'room.3': {
    id: 3,
    name: 'Bank of Atlanta',
    description: 'Deposit money, make little interest',
    exits: { n: 1 },
  },
  'room.4': {
    id: 4,
    name: 'Weapon Shop',
    description: 'Buy stuff for your expeditions',
    exits: { w: 1 },
  },
  'room.5': {
    id: 5,
    name: 'Magic Shop',
    description: 'Buy spells here',
    exits: { e: 1, w: { 6: [1] } },
  },
  'room.6': {
    id: 6,
    name: 'Secret Shop',
    description: 'Super secret stuff here',
    exits: { e: { 5: [1] } },
  },
  'obstacle.1': {
    id: 1,
    type: 'door',
    state: { open: false },
  },
  'obstacle.2': {
    id: 2,
    type: 'compound',
    refs: [1],
  },
  // 'lock.1': {
  //   id: 1,
  // },
  // 'door.1': {
  //   id: 1,
  //   locks: [1],
  // },
  // 'item.1': {
  //   id: 1,
  //   name: 'Key',
  //   description: 'A beautiful key',
  //   locks: [1],
  // },
};
