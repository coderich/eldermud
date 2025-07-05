module.exports = {
  name: 'Elden Keep',
  description: "The Elden Keep's interior, a sprawling complex of corridors and chambers, stands as a testament to the town's illustrious past. Housing both the archives and residence of the current ruler, Lady Elethor, the keep is a bastion of history and power.",
  rooms: {
    entrance: {
      name: 'Entrance',
      terrain: 'urban',
      description: "The interior of the Elden Keep is a labyrinth of corridors and chambers, each echoing the glory of a bygone era. The keep contains the town's archives and serves as a residence for the current ruler, Lady Elethor.",
      exits: {
        d: '${self:map.eldenfort.rooms.eldenkeepEntrance}',
        n: '${self:map.eldenkeep.rooms.grandFoyer}',
      },
    },
    grandFoyer: {
      name: 'Grand Foyer',
      terrain: 'stone',
      description: 'A vast hall where the intricate stonework and tapestries tell stories of valor and chivalry. Statues of previous rulers line the gilded walls, with a regal staircase to the north leading to the residential chambers.',
      exits: {
        s: '${self:map.eldenkeep.rooms.entrance}',
        n: '${self:map.eldenkeep.rooms.regalStaircase}',
        e: '${self:map.eldenkeep.rooms.gildedCorridorEast}',
        w: '${self:map.eldenkeep.rooms.gildedCorridorWest}',
      },
    },
    regalStaircase: {
      name: 'Regal Staircase',
      terrain: 'carved stone',
      description: "The Regal Staircase sweeps upward in an elegant curve, its steps worn smooth by centuries of footsteps. Portraits of Lady Elethor's ancestors observe visitors with silent judgement from their ornate frames.",
      exits: {
        s: '${self:map.eldenkeep.rooms.grandFoyer}',
        n: '${self:map.eldenkeep.rooms.upperLanding}',
      },
    },
    upperLanding: {
      name: 'Upper Landing',
      terrain: 'polished wood',
      description: 'The Upper Landing offers a pause in the journey, with a magnificent view over the Grand Foyer below. Doors to the north and east hint at the private sanctuaries of the nobility, while a gallery to the west displays priceless heirlooms.',
      exits: {
        e: '${self:map.eldenkeep.rooms.eastWing}',
        w: '${self:map.eldenkeep.rooms.heirloomGallery}',
        n: '${self:map.eldenkeep.rooms.ladyElethorChambers}',
        s: '${self:map.eldenkeep.rooms.regalStaircase}',
      },
      paths: {
        n: '${self:map.eldenkeep.doors.lady}',
        e: '${self:map.eldenkeep.doors.archive}',
      },
    },
    eastWing: {
      // char: '📚',
      char: '🏦',
      name: 'East Wing',
      terrain: 'marble',
      description: "Here resides the Elden Keep's expansive archives, a series of vaults teeming with historical texts and scrolls. Scholars and scribes work diligently, preserving the lore and legalities of the land.",
      exits: {
        w: '${self:map.eldenkeep.rooms.upperLanding}',
      },
      paths: {
        w: '${self:map.eldenkeep.doors.archive}',
      },
    },
    heirloomGallery: {
      name: 'Heirloom Gallery',
      terrain: 'hardwood',
      description: "The Heirloom Gallery is a vaulted chamber where the family's treasures are displayed behind protective enchantments. Jewelry, weapons, and relics of power each have their own tale, curated by a knowledgeable steward.",
      exits: {
        e: '${self:map.eldenkeep.rooms.upperLanding}',
      },
    },
    ladyElethorChambers: {
      char: '👑',
      name: "Lady Elethor's Chambers",
      terrain: 'plush carpet',
      description: "Elegantly appointed and strictly private, the chambers of Lady Elethor exude luxury and authority. A grand canopy bed, a stately writing desk, and personal artifacts reflect the ruler's taste and station.",
      exits: {
        s: '${self:map.eldenkeep.rooms.upperLanding}',
      },
      paths: {
        s: '${self:map.eldenkeep.doors.lady}',
      },
    },
    gildedCorridorEast: {
      name: 'Gilded Corridor - East',
      terrain: 'stone',
      description: "Running east from the Grand Foyer, this corridor is adorned with ornate carvings and rich tapestries, leading to the Keep's chapel and library.",
      exits: {
        w: '${self:map.eldenkeep.rooms.grandFoyer}',
        n: '${self:map.eldenkeep.rooms.chapel}',
        e: '${self:map.eldenkeep.rooms.library}',
      },
    },
    gildedCorridorWest: {
      name: 'Gilded Corridor - West',
      terrain: 'stone',
      description: 'Mirroring its eastern counterpart, this corridor stretches westward, offering access to the dining hall and the council room, where matters of state are deliberated.',
      exits: {
        e: '${self:map.eldenkeep.rooms.grandFoyer}',
        n: '${self:map.eldenkeep.rooms.diningHall}',
        w: '${self:map.eldenkeep.rooms.councilRoom}',
      },
    },
    chapel: {
      char: '⛪',
      name: 'Chapel',
      terrain: 'sanctified stone',
      description: "A place of reverence and tranquility, the Chapel's stained glass windows paint the room with multicolored light, while the altar at the northern end stands as a testament to faith and tradition.",
      exits: {
        s: '${self:map.eldenkeep.rooms.gildedCorridorEast}',
      },
    },
    library: {
      char: '📖',
      name: 'Library',
      terrain: 'oak',
      description: 'Shelves laden with ancient tomes stretch to the vaulted ceiling, accessible by rolling ladders. The musty air is ripe with knowledge, and the quiet is only broken by the occasional turning of a page.',
      exits: {
        w: '${self:map.eldenkeep.rooms.gildedCorridorEast}',
      },
    },
    diningHall: {
      char: '🍽',
      name: 'Dining Hall',
      terrain: 'granite',
      description: 'Grand banquets were once hosted here beneath the watchful gaze of ancestral paintings. The long tables can accommodate scores of guests, with a great hearth providing warmth and comfort.',
      exits: {
        s: '${self:map.eldenkeep.rooms.gildedCorridorWest}',
      },
    },
    councilRoom: {
      // char: '🏛',
      char: '🪑',
      name: 'Council Room',
      terrain: 'mahogany',
      description: "A solemn round room ringed by high-backed chairs, the Council Room is the center of governance. Intricate carvings on the table depict the town's crest, symbolizing the weight of decisions made within these walls.",
      exits: {
        e: '${self:map.eldenkeep.rooms.gildedCorridorWest}',
      },
    },
  },
  doors: {
    lady: {
      name: 'Chambers Door',
      label: '${self:map.eldenkeep.doors.lady.status} door',
      opaque: '@{in:${self:map.eldenkeep.doors.lady.status}, closed, locked}',
      depiction: 'This door, subtle yet elegant, leads to the private chambers of Lady Elethor. It is crafted from polished mahogany, its surface smooth and unblemished, hinting at the refined taste of its occupant. The door features delicate carvings of intertwined vines, a symbol of nobility and elegance, and is adorned with a finely wrought silver handle. A small, discreet plaque near the handle reads "Lady Elethor", adding a touch of personalization to the otherwise austere entrance.',
      status: 'locked',
      durability: 100,
      picklock: 100,
      key: '${self:map.eldenkeep.key.ladyElethor}',
    },
    archive: {
      name: 'Archive Door',
      label: '${self:map.eldenkeep.doors.archive.status} door',
      opaque: '@{in:${self:map.eldenkeep.doors.archive.status}, closed, locked}',
      depiction: 'This door, while not ostentatious, is a gateway to the expansive archives room within Elden Keep. It is made of solid oak, with a simple rectangular design that allows for easy access without unnecessary embellishments. Despite its simplicity, the door serves as a testament to the importance of knowledge and the dedication to preserving it.',
      status: 'closed',
      durability: 100,
      picklock: 100,
    },
  },
};
