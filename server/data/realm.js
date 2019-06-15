module.exports = {
  users: {
    1: {
      id: 1,
      room: 1,
      name: 'chardy',
      isLoggedIn: true,
    },
  },
  rooms: {
    1: {
      id: 1,
      name: 'Town Square',
      description: 'People all come to gather, socialize, and have fun',
      exits: { n: 2, s: 3, e: 4, w: 5 },
    },
    2: {
      id: 2,
      name: 'Bakery Shop',
      description: 'The best damn goodies you ever saw',
      exits: { s: 1 },
    },
    3: {
      id: 3,
      name: 'Bank of Atlanta',
      description: 'Deposit money, make little interest',
      exits: { n: 1 },
    },
    4: {
      id: 4,
      name: 'Weapon Shop',
      description: 'Buy stuff for your expeditions',
      exits: { w: 1 },
    },
    5: {
      id: 5,
      name: 'Magic Shop',
      description: 'Buy spells here',
      exits: { e: 1 },
    },
  },
  creatures: {
    1: {
      id: 1,
      name: 'Bat',
      description: 'A huge winged creature',
    },
  },
  npcs: {
    1: {
      id: 1,
      name: 'Richard',
      description: 'The best of the best',
    },
  },
  items: {
    1: {
      id: 1,
      name: 'Axe',
      description: 'Cleave stuff',
    },
  },
  shops: {
    1: {
      id: 1,
      name: 'Weapon Shop',
      description: 'Buy stuff for your expeditions',
      items: {
        1: {
          quantity: 5,
        },
      },
    },
  },
};
