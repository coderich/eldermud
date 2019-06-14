module.exports = {
  rooms: {
    1: {
      "name": "Town Square",
      "description": "People all come to gather, socialize, and have fun.",
      "exits": {
        "n": "2",
        "s": "3",
        "e": "4",
        "w": "5"
      }
    },
    2: {
      "name": "Bakery Shop",
      "description": "The best damn goodies you ever saw.",
      "exits": {
        "s": "1"
      }
    },
    3: {
      "name": "Bank of Atlanta",
      "description": "Deposit money, make little interest.",
      "exits": {
        "n": "1"
      }
    },
    4: {
      "name": "Weapon Shop",
      "description": "Buy stuff for your expeditions",
      "exits": {
        "w": "1"
      }
    },
    5: {
      "name": "Magic Shop",
      "description": "Buy spells here.",
      "exits": {
        "e": "1"
      }
    }
  },
  creatures: {

  },
  npcs: {

  },
};
