module.exports = {
  name: 'Elden Keep Interior',
  description: "The Elden Keep's interior, a sprawling complex of corridors and chambers, stands as a testament to the town's illustrious past. Housing both the archives and residence of the current ruler, Lady Elethor, the keep is a bastion of history and power.",
  rooms: {
    entrance: {
      name: 'Elden Keep',
      type: 'structure',
      terrain: 'urban',
      description: "The interior of the Elden Keep is a labyrinth of corridors and chambers, each echoing the glory of a bygone era. The keep contains the town's archives and serves as a residence for the current ruler, Lady Elethor.",
      exits: {
        d: '${self:map.eldenfort.rooms.eldenKeepEntrance}',
        n: '${self:map.eldenKeepInterior.rooms.grandFoyer}',
      },
    },
    grandFoyer: {
      name: 'Grand Foyer',
      type: 'structure',
      terrain: 'stone',
      description: 'A vast hall where the intricate stonework and tapestries tell stories of valor and chivalry. Statues of previous rulers line the gilded walls, with a regal staircase to the north leading to the residential chambers.',
      exits: {
        s: '${self:map.eldenKeepInterior.rooms.entrance}',
        n: '${self:map.eldenKeepInterior.rooms.regalStaircase}',
        e: '${self:map.eldenKeepInterior.rooms.gildedCorridorEast}',
        w: '${self:map.eldenKeepInterior.rooms.gildedCorridorWest}',
      },
    },
    regalStaircase: {
      name: 'Regal Staircase',
      type: 'pathway',
      terrain: 'carved stone',
      description: "The Regal Staircase sweeps upward in an elegant curve, its steps worn smooth by centuries of footsteps. Portraits of Lady Elethor's ancestors observe visitors with silent judgement from their ornate frames.",
      exits: {
        s: '${self:map.eldenKeepInterior.rooms.grandFoyer}',
        n: '${self:map.eldenKeepInterior.rooms.upperLanding}',
      },
    },
    upperLanding: {
      name: 'Upper Landing',
      type: 'intersection',
      terrain: 'polished wood',
      description: 'The Upper Landing offers a pause in the journey, with a magnificent view over the Grand Foyer below. Doors to the north and east hint at the private sanctuaries of the nobility, while a gallery to the west displays priceless heirlooms.',
      exits: {
        e: '${self:map.eldenKeepInterior.rooms.eastWing}',
        w: '${self:map.eldenKeepInterior.rooms.heirloomGallery}',
        n: '${self:map.eldenKeepInterior.rooms.ladyElethorChambers}',
        s: '${self:map.eldenKeepInterior.rooms.regalStaircase}',
      },
    },
    eastWing: {
      name: 'East Wing',
      type: 'structure',
      terrain: 'marble',
      description: "Here resides the Elden Keep's expansive archives, a series of vaults teeming with historical texts and scrolls. Scholars and scribes work diligently, preserving the lore and legalities of the land.",
      exits: {
        w: '${self:map.eldenKeepInterior.rooms.upperLanding}',
      },
    },
    heirloomGallery: {
      name: 'Heirloom Gallery',
      type: 'poi',
      terrain: 'hardwood',
      description: "The Heirloom Gallery is a vaulted chamber where the family's treasures are displayed behind protective enchantments. Jewelry, weapons, and relics of power each have their own tale, curated by a knowledgeable steward.",
      exits: {
        e: '${self:map.eldenKeepInterior.rooms.upperLanding}',
      },
    },
    ladyElethorChambers: {
      name: "Lady Elethor's Chambers",
      type: 'poi',
      terrain: 'plush carpet',
      description: "Elegantly appointed and strictly private, the chambers of Lady Elethor exude luxury and authority. A grand canopy bed, a stately writing desk, and personal artifacts reflect the ruler's taste and station.",
      exits: {
        s: '${self:map.eldenKeepInterior.rooms.upperLanding}',
      },
    },
    gildedCorridorEast: {
      name: 'Gilded Corridor - East',
      type: 'pathway',
      terrain: 'stone',
      description: "Running east from the Grand Foyer, this corridor is adorned with ornate carvings and rich tapestries, leading to the Keep's chapel and library.",
      exits: {
        w: '${self:map.eldenKeepInterior.rooms.grandFoyer}',
        n: '${self:map.eldenKeepInterior.rooms.chapel}',
        e: '${self:map.eldenKeepInterior.rooms.library}',
      },
    },
    gildedCorridorWest: {
      name: 'Gilded Corridor - West',
      type: 'pathway',
      terrain: 'stone',
      description: 'Mirroring its eastern counterpart, this corridor stretches westward, offering access to the dining hall and the council room, where matters of state are deliberated.',
      exits: {
        e: '${self:map.eldenKeepInterior.rooms.grandFoyer}',
        n: '${self:map.eldenKeepInterior.rooms.diningHall}',
        w: '${self:map.eldenKeepInterior.rooms.councilRoom}',
      },
    },
    chapel: {
      name: 'Chapel',
      type: 'poi',
      terrain: 'sanctified stone',
      description: "A place of reverence and tranquility, the Chapel's stained glass windows paint the room with multicolored light, while the altar at the northern end stands as a testament to faith and tradition.",
      exits: {
        s: '${self:map.eldenKeepInterior.rooms.gildedCorridorEast}',
      },
    },
    library: {
      name: 'Library',
      type: 'poi',
      terrain: 'oak',
      description: 'Shelves laden with ancient tomes stretch to the vaulted ceiling, accessible by rolling ladders. The musty air is ripe with knowledge, and the quiet is only broken by the occasional turning of a page.',
      exits: {
        w: '${self:map.eldenKeepInterior.rooms.gildedCorridorEast}',
      },
    },
    diningHall: {
      name: 'Dining Hall',
      type: 'structure',
      terrain: 'granite',
      description: 'Grand banquets were once hosted here beneath the watchful gaze of ancestral paintings. The long tables can accommodate scores of guests, with a great hearth providing warmth and comfort.',
      exits: {
        s: '${self:map.eldenKeepInterior.rooms.gildedCorridorWest}',
      },
    },
    councilRoom: {
      name: 'Council Room',
      type: 'structure',
      terrain: 'mahogany',
      description: "A solemn round room ringed by high-backed chairs, the Council Room is the center of governance. Intricate carvings on the table depict the town's crest, symbolizing the weight of decisions made within these walls.",
      exits: {
        e: '${self:map.eldenKeepInterior.rooms.gildedCorridorWest}',
      },
    },
  },
};
