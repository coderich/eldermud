module.exports = {
  name: 'Eldenfort Abandoned Residence',
  description: 'The once majestic residence of Eldenfort now stands in ruins, its grandeur swallowed by time and neglect. This broken-down abode is rumored to harbor the mislaid treasures of the Eldenfort family, alongside whispers of unsettled spirits roaming its dilapidated halls. Adventurers who brave its crumbling architecture must navigate through the first floor, second floor, and the eerie basement.',
  rooms: {
    foyer: {
      name: 'Foyer',
      type: 'intersection',
      terrain: 'wooden flooring with debris',
      description: 'The foyer, with its decaying wooden floor and scattered debris from the collapsed ceiling, sets a forlorn tone for the residence. Broken portraits and tarnished chandeliers bear silent witness to the grand past. It connects to the parlor, the dining hall, the grand staircase leading upward, and a hidden stairway to the basement.',
      exits: {
        n: '${self:map.eldenfortResidence.rooms.parlor}',
        w: '${self:map.eldenfortResidence.rooms.diningHall}',
        u: '${self:map.eldenfortResidence.rooms.grandStaircaseFirst}',
        d: '${self:map.eldenfortResidence.rooms.basementStairway}',
        e: '${self:map.eldenfort.rooms.westernDeadEnd}',
      },
    },
    parlor: {
      name: 'Parlor',
      type: 'poi',
      terrain: 'carpeted with moth-eaten rugs',
      description: 'The once elegant parlor is now dim and dust-laden, with moth-eaten rugs and fading wall hangings. Here, adventurers may find remnants of opulence and despair amidst the torn upholstery of antique sofas.',
      exits: {
        s: '${self:map.eldenfortResidence.rooms.foyer}',
      },
    },
    diningHall: {
      name: 'Dining Hall',
      type: 'poi',
      terrain: 'wooden floor with stained remnants',
      description: 'This grand dining hall houses a lengthy banquet table, now overturned and covered in rodent droppings and stains of long-spilled feasts. Echoes of laughter and clinking glasses are now replaced with an eerie silence.',
      exits: {
        e: '${self:map.eldenfortResidence.rooms.foyer}',
      },
    },
    grandStaircaseFirst: {
      name: 'Grand Staircase - First Floor',
      type: 'intersection',
      terrain: 'carved wooden staircase',
      description: 'The grand staircase, adorned with intricate woodwork, spirals upward, its creaky steps leading to the second floor. The railing, though splintered, still boasts its former magnificence. A cold draft descends from the unseen upper hallways.',
      exits: {
        d: '${self:map.eldenfortResidence.rooms.foyer}',
        u: '${self:map.eldenfortResidence.rooms.grandStaircaseSecond}',
      },
    },
    basementStairway: {
      name: 'Basement Stairway',
      type: 'pathway',
      terrain: 'narrow stone steps',
      description: 'A concealed stairway behind a movable panel in the foyer leads into the depths of the basement. The air is damp and musty, with a faint hint of mildew as the stone steps descend into the gloom.',
      exits: {
        u: '${self:map.eldenfortResidence.rooms.foyer}',
        d: '${self:map.eldenfortResidence.rooms.basementLanding}',
      },
    },
    grandStaircaseSecond: {
      name: 'Grand Staircase - Second Floor',
      type: 'corner',
      terrain: 'carved wooden landing',
      description: 'At the top of the stairs lies a landing with a broken windowpane, allowing thin rays of light and a chilly draft to pass. It offers paths to the master bedroom, the library, and a collapsed hallway, which requires careful navigation.',
      exits: {
        d: '${self:map.eldenfortResidence.rooms.grandStaircaseFirst}',
        e: '${self:map.eldenfortResidence.rooms.masterBedroom}',
        s: '${self:map.eldenfortResidence.rooms.library}',
        w: '${self:map.eldenfortResidence.rooms.collapsedHallway}',
      },
    },
    masterBedroom: {
      name: 'Master Bedroom',
      type: 'poi',
      terrain: 'rotted wooden planks',
      description: 'The master bedroom holds a decayed four-poster bed framed by tattered curtains. A heavy air of abandonment looms as the remnants of personal belongings lay scattered, untouched for years.',
      exits: {
        w: '${self:map.eldenfortResidence.rooms.grandStaircaseSecond}',
      },
    },
    library: {
      name: 'Library',
      type: 'poi',
      terrain: 'littered with books and broken shelves',
      description: 'The library, once a sanctum of knowledge, is now a graveyard of bookshelves and scattered tomes. Notes from a decaying piano add a haunting melody to the otherwise silent room.',
      exits: {
        n: '${self:map.eldenfortResidence.rooms.grandStaircaseSecond}',
      },
    },
    collapsedHallway: {
      name: 'Collapsed Hallway',
      type: 'pathway',
      terrain: 'unstable wooden beams',
      description: 'A hallway, partially collapsed and fraught with danger, demands careful steps to traverse without succumbing to the void below. From here, one may risk accessing the second-floor guest room.',
      exits: {
        e: '${self:map.eldenfortResidence.rooms.grandStaircaseSecond}',
        w: '${self:map.eldenfortResidence.rooms.guestRoom}',
      },
    },
    guestRoom: {
      name: 'Guest Room',
      type: 'poi',
      terrain: 'sinking wood',
      description: 'The guest room, veiled in a layer of dust and cobwebs, whispers secrets of past visitors. The stale bedding and collapsed wardrobe hint at long-forgotten hastiness left behind.',
      items: ['${self:chest.eldenfortResidence.small}'],
      exits: {
        e: '${self:map.eldenfortResidence.rooms.collapsedHallway}',
      },
    },
    basementLanding: {
      name: 'Basement Landing',
      type: 'corner',
      terrain: 'moist earth',
      description: 'At the bottom of the basement stairway, the air grows colder and the smell of earth stronger. From the landing, one can proceed to the wine cellar or the storage room.',
      exits: {
        u: '${self:map.eldenfortResidence.rooms.basementStairway}',
        n: '${self:map.eldenfortResidence.rooms.wineCellar}',
        e: '${self:map.eldenfortResidence.rooms.storageRoom}',
      },
    },
    wineCellar: {
      name: 'Wine Cellar',
      type: 'poi',
      terrain: 'damp floor with broken bottles',
      description: "The pungent odor of spoiled wine permeates the air. Amidst the shards of broken bottles and deteriorated casks, one can imagine the cellar's once coveted collection.",
      exits: {
        s: '${self:map.eldenfortResidence.rooms.basementLanding}',
      },
    },
    storageRoom: {
      name: 'Storage Room',
      type: 'poi',
      terrain: 'packed earth',
      description: "This space, cluttered with rusting tools and remnants of preserved goods, alludes to the storage room's practical past. The odd assortment of items may still hold value for those willing to sift through the past.",
      items: ['${self:chest.eldenfortResidence.large}'],
      exits: {
        w: '${self:map.eldenfortResidence.rooms.basementLanding}',
      },
    },
  },
};
