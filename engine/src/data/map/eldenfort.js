module.exports = {
  name: 'Eldenfort',
  description: 'An ancient town with cobblestone paths leading through vibrant markets and quiet residential alleys. In the heart of the town stands the majestic Elden Keep, guarding the secrets of the past.',
  rooms: {
    marketSquare: {
      name: 'Market Square',
      type: 'poi',
      terrain: 'urban',
      description: 'The Market Square is a hive of activity, where vendors from all around come to sell their wares. The scent of fresh bread and herbs permeates the air, and the sound of haggling fills the ears. The Elden Keep can be glimpsed to the north.',
      exits: {
        n: '${self:map.eldenfort.rooms.eldenKeepEntrance}',
        w: '${self:map.eldenfort.rooms.westAlley}',
        e: '${self:map.eldenfort.rooms.eastAlley}',
        s: '${self:map.eldenfort.rooms.southGate}',
      },
    },
    eldenKeepEntrance: {
      name: 'Elden Keep Entrance',
      type: 'poi',
      terrain: 'urban',
      description: "The entrance to the Elden Keep is guarded by stone gargoyles, silent watchers of the town's comings and goings. The heavy oak doors are adorned with ironwork, speaking to the stronghold's might and the secrets it holds within.",
      exits: {
        s: '${self:map.eldenfort.rooms.marketSquare}',
        u: '${self:map.eldenKeepInterior.rooms.entrance}',
      },
    },
    southGate: {
      name: 'South Gate',
      type: 'poi',
      terrain: 'urban',
      description: 'The South Gate stands as the main artery through which the life of the town flows. Merchants, travelers, and adventurers pass under its shadow, guarded by vigilant town watch.',
      exits: {
        n: '${self:map.eldenfort.rooms.marketSquare}',
        s: '${self:map.eldenfort.rooms.southRoad}',
      },
    },
    southRoad: {
      name: 'South Road',
      type: 'pathway',
      terrain: 'urban',
      description: 'The South Road stretches out from the gate, a well-trodden road leading travelers into the countryside beyond.',
      exits: {
        n: '${self:map.eldenfort.rooms.southGate}',
        s: '${self:map.eldenfortCountryside.rooms.entranceToCountryside}',
      },
    },
    westAlley: {
      name: 'West Alley',
      type: 'intersection',
      terrain: 'urban',
      description: 'The West Alley is a quieter vein of the town, where local residents come and go about their daily lives, away from the hustle of the market.',
      exits: {
        e: '${self:map.eldenfort.rooms.marketSquare}',
        s: '${self:map.eldenfort.rooms.westCorner}',
        w: '${self:map.eldenfort.rooms.westEnd}',
      },
    },
    westEnd: {
      name: 'West End',
      type: 'corner',
      terrain: 'urban',
      description: "The aptly named West End is a cul-de-sac bordered by the town's ancient walls, offering a moment of tranquility and a touch of greenery with its overgrown ivy.",
      exits: {
        e: '${self:map.eldenfort.rooms.westAlley}',
      },
    },
    westCorner: {
      name: 'West Corner',
      type: 'corner',
      terrain: 'urban',
      description: 'A sharp turn that leads to the residential areas of the town, marked by a weathered fountain that no longer runs.',
      exits: {
        n: '${self:map.eldenfort.rooms.westAlley}',
        w: '${self:map.eldenfort.rooms.westernResidences}',
      },
    },
    westernResidences: {
      name: 'Western Residences',
      type: 'pathway',
      terrain: 'urban',
      description: "This street is home to the town's craftspeople and merchants. The sound of a blacksmith at work rings out intermittently, blending with children's laughter.",
      exits: {
        e: '${self:map.eldenfort.rooms.westCorner}',
        w: '${self:map.eldenfort.rooms.westernDeadEnd}',
      },
    },
    westernDeadEnd: {
      name: 'Western Dead End',
      type: 'corner',
      terrain: 'urban',
      description: 'A small, forgotten corner of the town, where old toys and broken furniture hint at stories untold.',
      exits: {
        e: '${self:map.eldenfort.rooms.westernResidences}',
      },
    },
    eastAlley: {
      name: 'East Alley',
      type: 'intersection',
      terrain: 'urban',
      description: 'An alley laden with the fragrances of nearby bakeries and the distant toll of the chapel bell.',
      exits: {
        w: '${self:map.eldenfort.rooms.marketSquare}',
        n: '${self:map.eldenfort.rooms.eastEnd}',
        e: '${self:map.eldenfort.rooms.chapelRoad}',
      },
    },
    eastEnd: {
      name: 'East End',
      type: 'corner',
      terrain: 'urban',
      description: "The road culminates here, with an impressive view of the Elden Keep to the northwest, and a sun-warmed brick wall that's a popular resting spot for the local cats.",
      exits: {
        s: '${self:map.eldenfort.rooms.eastAlley}',
      },
    },
    chapelRoad: {
      name: 'Chapel Road',
      type: 'pathway',
      terrain: 'urban',
      description: 'Along this road, the distant singing from the chapel can be heard, inviting townsfolk to reflection and prayer.',
      exits: {
        w: '${self:map.eldenfort.rooms.eastAlley}',
        e: '${self:map.eldenfort.rooms.chapelSquare}',
      },
    },
    chapelSquare: {
      name: 'Chapel Square',
      type: 'poi',
      terrain: 'urban',
      description: 'The square is peaceful, a sanctuary within the town where people come to find solace, surrounded by small gardens meticulously maintained by the monks.',
      exits: {
        w: '${self:map.eldenfort.rooms.chapelRoad}',
        e: '${self:map.eldenfort.rooms.chapelEntrance}',
      },
    },
    chapelEntrance: {
      name: 'Chapel Entrance',
      type: 'poi',
      terrain: 'urban',
      description: "The entrance to the Chapel of Elden is an archway of carved stone, depicting the town's history. The dimly lit interior promises a reprieve from the outside world.",
      exits: {
        w: '${self:map.eldenfort.rooms.chapelSquare}',
        u: '${self:map.eldenfortChapel.rooms.entrance}',
      },
    },
  },
  spawns: [
    { num: 1, max: 3, units: ['${self:creature.cat}'] },
    { num: 1, max: 3, units: ['${self:creature.rat}'] },
  ],
};
