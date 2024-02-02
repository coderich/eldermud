module.exports = {
  name: 'Town of Echoes',
  description: 'A once-bustling town now whispers with the memories of its past. Mysterious forces drove its inhabitants away, leaving behind only their echo-like presences to wander the empty streets. Rumors speak of ancient relics hidden among the desolate buildings, and eerie lights are seen flickering in the windows at night. Travelers who come across this ghost town report hearing their own voices being thrown back at them from the silence.',
  rooms: {
    centralPlaza: {
      name: 'Central Plaza',
      type: 'poi',
      terrain: 'pavement',
      description: "The open space of the central plaza is surrounded by derelict buildings, their facades crumbling. An ornate, dried-up fountain stands as a mute witness to countless gatherings of the past. The sounds seem to linger here longer, as if the very air is reluctant to let go of the town's history.",
      exits: {
        n: '${self:map.townOfEchoes.rooms.northRoad}',
        s: '${self:map.townOfEchoes.rooms.southRoad}',
        e: '${self:map.townOfEchoes.rooms.eastRoad}',
        w: '${self:map.townOfEchoes.rooms.westRoad}',
        ne: '${self:map.townOfEchoes.rooms.northEastPath}',
        nw: '${self:map.townOfEchoes.rooms.northWestPath}',
        se: '${self:map.townOfEchoes.rooms.southEastPath}',
        sw: '${self:map.townOfEchoes.rooms.southWestPath}',
      },
    },
    abandonedInn: {
      name: 'Abandoned Inn',
      type: 'poi',
      terrain: 'wood',
      description: "The remains of the town's inn loom before you, its timeworn sign still swinging on rusty chains. Inside, the debris of what once were cozy rooms and a lively tavern lay scattered about. Ghostly laughter seems to bubble up from the silence, and the air is thick with the scent of forgotten stories.",
      exits: {
        n: '${self:map.townOfEchoes.rooms.northRoad}',
        e: '${self:map.townOfEchoes.rooms.hiddenAlley}',
      },
    },
    cursedMarketplace: {
      name: 'Cursed Marketplace',
      type: 'poi',
      terrain: 'cobblestone',
      description: "A once-bustling marketplace, now just rows of empty stalls shadowed by faded awnings. It's said that objects left behind still hold the desires of their former owners, and the occasional glint of spectral merchandise can be seen out of the corner of the eye.",
      exits: {
        s: '${self:map.townOfEchoes.rooms.hiddenAlley}',
        w: '${self:map.townOfEchoes.rooms.westRoad}',
      },
    },
    forgottenLibrary: {
      name: 'Forgotten Library',
      type: 'structure',
      terrain: 'marble',
      description: 'The library stands silent, a tomb for the knowledge it once held. Shelves bending under the weight of dust-covered books create narrow pathways that seem to stretch on indefinitely. Whispers can be heard as pages randomly turn, as if guided by unseen scholars from the past.',
      exits: {
        n: '${self:map.townOfEchoes.rooms.hiddenAlley}',
        e: '${self:map.townOfEchoes.rooms.eastRoad}',
      },
    },
    northRoad: {
      name: 'North Road',
      type: 'pathway',
      terrain: 'gravel',
      description: 'The road here bends northward, flanked on either side by desolate homes. A chill wind carries the scents of decay and abandonment. The road itself seems unused, the gravel overgrown with rogue plants that have claimed the space.',
      exits: {
        s: '${self:map.townOfEchoes.rooms.centralPlaza}',
        n: '${self:map.townOfEchoes.rooms.northOutskirts}',
      },
    },
    southRoad: {
      name: 'South Road',
      type: 'pathway',
      terrain: 'dirt',
      description: 'Stretching to the southern reaches of the town, this road leads toward the more residential areas. Fences border the pathway, behind which lie the ruins of gardens that once bloomed with life, now overgrown and wild.',
      exits: {
        n: '${self:map.townOfEchoes.rooms.centralPlaza}',
        s: '${self:map.townOfEchoes.rooms.southOutskirts}',
      },
    },
    eastRoad: {
      name: 'East Road',
      type: 'pathway',
      terrain: 'sand',
      description: 'East Road is a sandy stretch, worn smooth by what must have been a time of lively foot traffic to the now-nonexistent docks. The sounds of the lost sea seem to echo eerily among the abandoned fishmonger stalls.',
      exits: {
        w: '${self:map.townOfEchoes.rooms.centralPlaza}',
        e: '${self:map.townOfEchoes.rooms.eastOutskirts}',
      },
    },
    westRoad: {
      name: 'West Road',
      type: 'pathway',
      terrain: 'pavement',
      description: "Once a grand avenue leading to the town hall, West Road now stands as a bleak reminder of the town's descent into silence. The cracks in the pavement seem to tell a story of unrest, and the whispers of past proclamations can almost be heard on the wind.",
      exits: {
        e: '${self:map.townOfEchoes.rooms.centralPlaza}',
        w: '${self:map.townOfEchoes.rooms.westOutskirts}',
      },
    },
    northEastPath: {
      name: 'Northeast Path',
      type: 'pathway',
      terrain: 'dirt',
      description: "This narrow path weaves between the once-lavish houses of the town's elite. Their grandeur has faded, their secrets seeping into the soil, giving the earth here a strange, heavy feeling.",
      exits: {
        sw: '${self:map.townOfEchoes.rooms.centralPlaza}',
        ne: '${self:map.townOfEchoes.rooms.northEastCorner}',
      },
    },
    northWestPath: {
      name: 'Northwest Path',
      type: 'pathway',
      terrain: 'gravel',
      description: "Crunching gravel underfoot, you traverse the Northwestern Path, which once led to the town's mine. It passes by abandoned equipment and carts that seem as if they could roll away on their own at any moment.",
      exits: {
        se: '${self:map.townOfEchoes.rooms.centralPlaza}',
        nw: '${self:map.townOfEchoes.rooms.northWestCorner}',
      },
    },
    southEastPath: {
      name: 'Southeast Path',
      type: 'pathway',
      terrain: 'gravel',
      description: 'Curving gently between small cottages, Southeast Path shows signs of a hasty departure; doors are left open, and personal items are strewn about, as if their owners will return at any moment.',
      exits: {
        nw: '${self:map.townOfEchoes.rooms.centralPlaza}',
        se: '${self:map.townOfEchoes.rooms.southEastCorner}',
      },
    },
    southWestPath: {
      name: 'Southwest Path',
      type: 'pathway',
      terrain: 'dirt',
      description: "Winding towards what used to be the town's orchards, the Southwest Path is now overgrown. The scent of rotting fruit mingles with the chill in the air, creating an unsettling atmosphere.",
      exits: {
        ne: '${self:map.townOfEchoes.rooms.centralPlaza}',
        sw: '${self:map.townOfEchoes.rooms.southWestCorner}',
      },
    },
    hiddenAlley: {
      name: 'Hidden Alley',
      type: 'pathway',
      terrain: 'cobblestone',
      description: "Narrow and easily missed, the Hidden Alley snakes behind the buildings. Even the local children didn't dare explore it much, claiming it was haunted by something unseen that would brush past in the shadows.",
      exits: {
        n: '${self:map.townOfEchoes.rooms.cursedMarketplace}',
        s: '${self:map.townOfEchoes.rooms.forgottenLibrary}',
        e: '${self:map.townOfEchoes.rooms.abandonedInn}',
      },
    },
    northOutskirts: {
      name: 'North Outskirts',
      type: 'intersection',
      terrain: 'gravel',
      description: "The outskirts to the north of the town mark the edge of habitation. Beyond lies untamed forest, and few dare to venture into the wilderness rumored to be the source of the town's curse.",
      exits: {
        s: '${self:map.townOfEchoes.rooms.northRoad}',
        n: '${self:map.townOfEchoes.rooms.deepWoods}',
      },
    },
    southOutskirts: {
      name: 'South Outskirts',
      type: 'intersection',
      terrain: 'dirt',
      description: "As the town gives way to open land, the South Outskirts are where the echo of the town's life is faintest. The barren fields stretch towards the horizon, with no sign of what drove the people away.",
      exits: {
        n: '${self:map.townOfEchoes.rooms.southRoad}',
        s: '${self:map.townOfEchoes.rooms.desolatePlains}',
      },
    },
    eastOutskirts: {
      name: 'East Outskirts',
      type: 'intersection',
      terrain: 'sand',
      description: 'Here at the East Outskirts, the ground is gritty with the sand blown from the now-distant sea. The remains of the dock still stand, half-submerged in earth rather than water, as if the sea simply retreated one night and never returned.',
      exits: {
        w: '${self:map.townOfEchoes.rooms.eastRoad}',
        e: '${self:map.townOfEchoes.rooms.sunkenDocks}',
      },
    },
    westOutskirts: {
      name: 'West Outskirts',
      type: 'intersection',
      terrain: 'pavement',
      description: 'The pavement ends abruptly at the West Outskirts, giving way to rough, untamed ground. The town hall, once the center of governance, is now nothing more than an outline against the setting sun.',
      exits: {
        e: '${self:map.townOfEchoes.rooms.westRoad}',
        w: '${self:map.townOfEchoes.rooms.collapsedHall}',
      },
    },
    northEastCorner: {
      name: 'Northeast Corner',
      type: 'corner',
      terrain: 'dirt',
      description: 'Sheltered by the remnants of an old stone wall, the Northeast Corner of the town is a silent testament to the boundaries of a community that sought to guard itself against outside forces. Now, the wall is just another structure succumbing to time.',
      exits: {
        sw: '${self:map.townOfEchoes.rooms.northEastPath}',
      },
    },
    northWestCorner: {
      name: 'Northwest Corner',
      type: 'corner',
      terrain: 'gravel',
      description: "At the Northwestern Corner, what's left of watchtowers stand like sentinels. Sightless, they face out towards the dark mine entrances that riddle the nearby hills, the origin of both wealth and woe for the town.",
      exits: {
        se: '${self:map.townOfEchoes.rooms.northWestPath}',
      },
    },
    southEastCorner: {
      name: 'Southeast Corner',
      type: 'corner',
      terrain: 'gravel',
      description: "The Southeast Corner is where the roads meet the outskirts of the town. A charming gazebo, now overgrown with vines, offers a last nostalgic glimpse of the town's more pleasant days.",
      exits: {
        nw: '${self:map.townOfEchoes.rooms.southEastPath}',
      },
    },
    southWestCorner: {
      name: 'Southwest Corner',
      type: 'corner',
      terrain: 'dirt',
      description: "The Southwest Corner is thick with the scent of wild orchards. Though the trees are dead, their twisted forms still reach for the sky, as if mimicking the townsfolk's unanswered pleas for salvation.",
      exits: {
        ne: '${self:map.townOfEchoes.rooms.southWestPath}',
      },
    },
    deepWoods: {
      name: 'Deep Woods',
      type: 'pathway',
      terrain: 'dirt',
      description: "Heavy foliage blocks out much of the light in the Deep Woods, which begin just north of town. It's easy to imagine how the townsfolk might have felt a presence lurking here, watching them from the shadows.",
      exits: {
        n: '${self:map.eldenfort.rooms.southRoad}',
        s: '${self:map.townOfEchoes.rooms.northOutskirts}',
      },
    },
    desolatePlains: {
      name: 'Desolate Plains',
      type: 'pathway',
      terrain: 'dirt',
      description: "The plains are a vast expanse of emptiness that mirrors the abandonment of the town. Here the earth is cracked, dry, and as lifeless as the deserted streets from which you've come.",
      exits: {
        n: '${self:map.townOfEchoes.rooms.southOutskirts}',
      },
    },
    sunkenDocks: {
      name: 'Sunken Docks',
      type: 'pathway',
      terrain: 'sand',
      description: "All that's left of the bustling port are a few rotten planks and support beams rising from the ground like skeletal fingers. The docks are a graveyard for the ships that will never return.",
      exits: {
        w: '${self:map.townOfEchoes.rooms.eastOutskirts}',
      },
    },
    collapsedHall: {
      name: 'Collapsed Town Hall',
      type: 'pathway',
      terrain: 'pavement',
      description: 'The ruins of the town hall stand in stark sadness, collapsed under the weight of its own history. Here, decisions were made that shaped the lives within the town; now, it shapes nothing more than a forlorn horizon.',
      exits: {
        e: '${self:map.townOfEchoes.rooms.westOutskirts}',
      },
    },
  },
};
