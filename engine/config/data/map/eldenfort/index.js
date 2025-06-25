module.exports = {
  name: 'Eldenfort',
  description: 'An ancient town with cobblestone paths leading through vibrant markets and quiet residential alleys. In the heart of the town stands the majestic Elden Keep, guarding the secrets of the past.',
  backstory: `
    Eldenfort was once known as the "City of Whispers," a place where tales of magic and mystery were whispered among the townsfolk.

    It was founded over a thousand years ago by a group of enigmatic travelers who sought refuge from the harsh world outside.
    These travelers brought with them ancient knowledge and artifacts, which they used to create a sanctuary of peace and learning within the city walls.

    The city was built around the Elden Keep, a grand fortress that served not only as a symbol of protection but also as a repository for the arcane lore and relics collected by the founders.
    The keep's towering spires reached towards the heavens, casting long shadows that danced across the cobblestone streets during the day and glowed with an ethereal light at night.

    Over time, Eldenfort became a hub for scholars, mystics, and adventurers from all corners of the realm.
    Its libraries were filled with tomes that held the wisdom of ages, and its markets bustled with exotic goods and rare artifacts.
    Yet, despite its prosperity, the city remained shrouded in a veil of secrecy, with many of its most profound mysteries kept hidden even from its own inhabitants.

    The true power of Eldenfort lay in the Elden Keep.
    Within its hallowed halls, the keep's guardians maintained a vigilant watch over the ancient relics and forbidden texts.
    Among these treasures was the "Scepter of the Ancients," a powerful artifact rumored to grant its wielder control over the elements.
    However, the scepter was said to be cursed, and those who dared to seek its power often met with untimely ends.

    In recent times, whispers of a great calamity have begun to echo through the streets of Eldenfort.
    Some believe that the keep's secrets are the key to averting this impending disaster, while others fear that the very act of revealing these secrets could trigger the downfall of the city.
    As the town prepares for the unknown, the residents of Eldenfort must decide whether to embrace the truth or continue living in the shadow of their own history.
  `,
  rooms: {
    marketSquare: {
      name: 'Market Square',
      terrain: 'urban',
      description: 'The Market Square is a hive of activity, where vendors from all around come to sell their wares. The scent of fresh bread and herbs permeates the air, and the sound of haggling fills the ears. The Elden Keep can be glimpsed to the north.',
      exits: {
        n: '${self:map.eldenfort.rooms.eldenkeepEntrance}',
        w: '${self:map.eldenfort.rooms.westAlley}',
        e: '${self:map.eldenfort.rooms.eastAlley}',
        s: '${self:map.eldenfort.rooms.southGate}',
      },
    },
    eldenkeepEntrance: {
      name: 'Elden Keep Entrance',
      terrain: 'urban',
      description: "The entrance to the Elden Keep is guarded by stone gargoyles, silent watchers of the town's comings and goings. The heavy oak doors are adorned with ironwork, speaking to the stronghold's might and the secrets it holds within.",
      exits: {
        s: '${self:map.eldenfort.rooms.marketSquare}',
        u: '${self:map.eldenkeep.rooms.entrance}',
      },
    },
    southGate: {
      name: 'South Gate',
      terrain: 'urban',
      description: 'The South Gate stands as the main artery through which the life of the town flows. Merchants, travelers, and adventurers pass under its shadow, guarded by vigilant town watch.',
      exits: {
        n: '${self:map.eldenfort.rooms.marketSquare}',
        s: '${self:map.eldenfort.rooms.southRoad}',
      },
      paths: {
        s: '${self:map.eldenfort.doors.southGate}',
      },
    },
    southRoad: {
      name: 'South Road',
      terrain: 'urban',
      description: 'The South Road stretches out from the gate, a well-trodden road leading travelers into the countryside beyond.',
      exits: {
        n: '${self:map.eldenfort.rooms.southGate}',
        s: '${self:map.eldenfortCountryside.rooms.entranceToCountryside}',
      },
      paths: {
        n: '${self:map.eldenfort.doors.southGate}',
      },
    },
    westAlley: {
      name: 'West Alley',
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
      terrain: 'urban',
      description: "The aptly named West End is a cul-de-sac bordered by the town's ancient walls, offering a moment of tranquility and a touch of greenery with its overgrown ivy.",
      exits: {
        e: '${self:map.eldenfort.rooms.westAlley}',
      },
    },
    westCorner: {
      name: 'West Corner',
      terrain: 'urban',
      description: 'A sharp turn that leads to the residential areas of the town, marked by a weathered fountain that no longer runs.',
      exits: {
        n: '${self:map.eldenfort.rooms.westAlley}',
        w: '${self:map.eldenfort.rooms.westernResidences}',
      },
    },
    westernResidences: {
      name: 'Western Residences',
      terrain: 'urban',
      description: "This street is home to the town's craftspeople and merchants. The sound of a blacksmith at work rings out intermittently, blending with children's laughter.",
      exits: {
        e: '${self:map.eldenfort.rooms.westCorner}',
        w: '${self:map.eldenfort.rooms.westernDeadEnd}',
      },
    },
    westernDeadEnd: {
      name: 'Western Dead End',
      terrain: 'urban',
      description: 'A small, forgotten corner of the town, where old toys and broken furniture hint at stories untold.',
      exits: {
        e: '${self:map.eldenfort.rooms.westernResidences}',
      },
      paths: {
        w: {
          name: 'Residence',
          label: 'hidden passage',
          status: 'hidden',
          depiction: 'Hello',
          opaque: true,
          toString: () => 'eldenfortResidence',
        },
      },
    },
    eastAlley: {
      name: 'East Alley',
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
      terrain: 'urban',
      description: "The road culminates here, with an impressive view of the Elden Keep to the northwest, and a sun-warmed brick wall that's a popular resting spot for the local cats.",
      exits: {
        s: '${self:map.eldenfort.rooms.eastAlley}',
      },
    },
    chapelRoad: {
      name: 'Chapel Road',
      terrain: 'urban',
      description: 'Along this road, the distant singing from the chapel can be heard, inviting townsfolk to reflection and prayer.',
      exits: {
        w: '${self:map.eldenfort.rooms.eastAlley}',
        e: '${self:map.eldenfort.rooms.chapelSquare}',
      },
    },
    chapelSquare: {
      name: 'Chapel Square',
      terrain: 'urban',
      description: 'The square is peaceful, a sanctuary within the town where people come to find solace, surrounded by small gardens meticulously maintained by the monks.',
      exits: {
        w: '${self:map.eldenfort.rooms.chapelRoad}',
        e: '${self:map.eldenfort.rooms.chapelEntrance}',
      },
    },
    chapelEntrance: {
      name: 'Chapel Entrance',
      terrain: 'urban',
      description: "The entrance to the Chapel of Elden is an archway of carved stone, depicting the town's history. The dimly lit interior promises a reprieve from the outside world.",
      exits: {
        w: '${self:map.eldenfort.rooms.chapelSquare}',
        u: '${self:map.eldenfortChapel.rooms.entrance}',
      },
    },
  },
  doors: {
    southGate: {
      name: 'South Gate of Eldenfort',
      depiction: 'A monumental structure that serves as the town\'s lifeblood. It is constructed from sturdy oak timbers, reinforced with iron bands, and adorned with intricate carvings that tell tales of the town\'s history. The gate is flanked by towering stone pillars, each bearing the crest of Eldenfort, and is surmounted by a grand archway that allows for the passage of wagons and mounted troops.',
      label: '${self:map.eldenfort.doors.southGate.status} gate',
      status: 'open',
      durability: 100,
      picklock: 100,
      traits: ['${self:trait.door}']
    },
  },
  // spawns: [
  //   { num: 1, max: 3, units: ['${self:creature.cat}'] },
  //   { num: 1, max: 3, units: ['${self:creature.rat}'] },
  // ],
};
