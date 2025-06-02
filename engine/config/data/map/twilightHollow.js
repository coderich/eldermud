module.exports = {
  name: 'Twilight Hollow',
  description: 'Twilight Hollow is a mysterious small town that revels under an eternal dusk, with the sky painted in hues of deep purples and blues. The town is rumored to be a nexus of arcane energies, which draw both curious adventurers and otherworldly creatures seeking the secrets beneath the twilight.',
  rooms: {
    townSquare: {
      name: 'Town Square',
      terrain: 'cobblestone',
      description: "At the heart of Twilight Hollow is the Town Square, surrounded by a variety of quaint shops. The ever-present twilight sky gives the cobblestone square an ethereal atmosphere. Exits lead in all directions, continuing the town's enigmatic pathways.",
      exits: {
        n: '${self:map.twilightHollow.rooms.marketStreet}',
        s: '${self:map.twilightHollow.rooms.astralAlley}',
        e: '${self:map.twilightHollow.rooms.whisperWay}',
        w: '${self:map.twilightHollow.rooms.shadowLane}',
        ne: '${self:map.twilightHollow.rooms.arcaneAvenue}',
        nw: '${self:map.twilightHollow.rooms.mysticMews}',
        se: '${self:map.twilightHollow.rooms.sunsetStreet}',
        sw: '${self:map.twilightHollow.rooms.moonlitPath}',
        u: '${self:map.twilightHollow.rooms.spireOfTwilight}',
        d: '${self:map.twilightHollow.rooms.crypticCatacombs}',
      },
    },
    marketStreet: {
      name: 'Market Street',
      terrain: 'cobblestone',
      description: 'This bustling street is known for Crystal Curiosities, a shop selling rare gems that seem to glow with an inner light. The energy of the crowds add life to the otherwise eerie ambiance of Twilight Hollow.',
      exits: {
        s: '${self:map.twilightHollow.rooms.townSquare}',
      },
    },
    astralAlley: {
      name: 'Astral Alley',
      terrain: 'cobblestone',
      description: "A crooked alley leading to The Star-Gazer's Inn, a cozy refuge for travelers. Its windows cast a soft golden glow onto the alley's stones.",
      exits: {
        n: '${self:map.twilightHollow.rooms.townSquare}',
      },
    },
    whisperWay: {
      name: 'Whisper Way',
      terrain: 'cobblestone',
      description: 'Whisper Way is eerily quiet except for the soft sounds coming from The Silent Library, a repository of mystical tomes.',
      exits: {
        w: '${self:map.twilightHollow.rooms.townSquare}',
      },
    },
    shadowLane: {
      name: 'Shadow Lane',
      terrain: 'cobblestone',
      description: 'A narrow lane that twists mysteriously into the darkness, as if shadows cling to the very air. It eventually leads back to the Town Square, forming a loop.',
      exits: {
        e: '${self:map.twilightHollow.rooms.townSquare}',
      },
    },
    arcaneAvenue: {
      name: 'Arcane Avenue',
      terrain: 'cobblestone',
      description: "Arcane symbols are etched into the buildings along this avenue, hinting at the magical nature of the town's inhabitants.",
      exits: {
        sw: '${self:map.twilightHollow.rooms.townSquare}',
      },
    },
    mysticMews: {
      name: 'Mystic Mews',
      terrain: 'cobblestone',
      description: 'The houses here are built closely together, creating a labyrinthine network of homes that seem to whisper secrets to the initiated.',
      exits: {
        se: '${self:map.twilightHollow.rooms.townSquare}',
      },
    },
    sunsetStreet: {
      name: 'Sunset Street',
      terrain: 'cobblestone',
      description: 'Despite the name, the sun never fully sets; it lingers on the horizon, bathing the street in permanent twilight.',
      exits: {
        nw: '${self:map.twilightHollow.rooms.townSquare}',
      },
    },
    moonlitPath: {
      name: 'Moonlit Path',
      terrain: 'cobblestone',
      description: "The path is illuminated by a moon that never wanes. It's a favored spot for nocturnal lovers and dreamers.",
      exits: {
        ne: '${self:map.twilightHollow.rooms.townSquare}',
      },
    },
    spireOfTwilight: {
      name: 'Spire of Twilight',
      terrain: 'stone',
      description: 'The Spire of Twilight rises above the town, its apex lost in the perpetual dusk. It serves as a beacon for those drawn to the arcane, and its foundation seems to extend below ground as much as it pierces the sky.',
      exits: {
        d: '${self:map.twilightHollow.rooms.townSquare}',
      },
    },
    crypticCatacombs: {
      name: 'Cryptic Catacombs',
      terrain: 'stone',
      description: 'Beneath the town, the catacombs wind and weave. Their cold stone walls are lined with cryptic symbols that pulse with an ancient power.',
      exits: {
        u: '${self:map.twilightHollow.rooms.townSquare}',
      },
    },
  },
};
