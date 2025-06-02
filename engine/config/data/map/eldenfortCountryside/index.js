module.exports = {
  name: 'Eldenfort Countryside',
  description: 'This sprawling countryside is characterized by lush green fields and a gentle breeze that carries the scent of wildflowers. The area is dotted with small farms and the ruins of ancient structures, a testament to a bygone era. The distant outline of the ancient town of Eldenfort looms to the north, its weathered walls speaking of a rich and mysterious past.',
  rooms: {
    entranceToCountryside: {
      name: 'Gateway to the Countryside',
      terrain: 'cobblestone road',
      description: 'An old cobblestone road marks the beginning of the countryside. Here, the hustle of Eldenfort fades into the tranquil sounds of nature. To the north, the towering gates of Eldenfort stand as silent guardians to history.',
      items: ['${self:sign.eldenfortCountryside.welcome}'],
      exits: {
        s: '${self:map.eldenfortCountryside.rooms.southernMeadow}',
        n: '${self:map.eldenfort.rooms.southRoad}',
      },
    },
    southernMeadow: {
      name: 'Southern Meadow',
      terrain: 'meadow',
      description: 'The road gives way to a blooming meadow, with wildflowers dancing in the wind. A calm brook trickles by, and the distant sound of cattle from nearby farms can be heard.',
      exits: {
        n: '${self:map.eldenfortCountryside.rooms.entranceToCountryside}',
        w: '${self:map.eldenfortCountryside.rooms.brooksidePathWest}',
        e: '${self:map.eldenfortCountryside.rooms.brooksidePathEast}',
        s: '${self:map.eldenfortCountryside.rooms.openFields}',
      },
    },
    brooksidePathWest: {
      name: 'Brookside Path - West',
      terrain: 'dirt path',
      description: 'A serene path runs parallel to the brook, heading deeper into the countryside. The chirping of birds accompanies travellers as they move along this peaceful trail.',
      exits: {
        e: '${self:map.eldenfortCountryside.rooms.southernMeadow}',
        s: '${self:map.eldenfortCountryside.rooms.westernFields}',
      },
    },
    brooksidePathEast: {
      name: 'Brookside Path - East',
      terrain: 'dirt',
      description: 'To the east, the brookside path meanders through a more densely wooded area, offering a quiet respite beneath the shade of tall oaks.',
      exits: {
        w: '${self:map.eldenfortCountryside.rooms.southernMeadow}',
        s: '${self:map.eldenfortCountryside.rooms.easternFields}',
      },
    },
    openFields: {
      name: 'Open Fields',
      terrain: 'grassland',
      description: 'The meadow opens into vast fields of tall grasses that sway in the wind like waves on the sea. The open sky above is a canvas of blue, occasionally painted with the white streaks of wandering clouds.',
      exits: {
        n: '${self:map.eldenfortCountryside.rooms.southernMeadow}',
        se: '${self:map.eldenfortCountryside.rooms.farmsteads}',
      },
    },
    westernFields: {
      name: 'Western Fields',
      terrain: 'fields',
      description: 'To the west, the countryside is marked with golden wheat fields, producing a vast golden blanket that covers the horizon.',
      exits: {
        n: '${self:map.eldenfortCountryside.rooms.brooksidePathWest}',
        s: '${self:map.eldenfortCountryside.rooms.oldWindmill}',
      },
    },
    oldWindmill: {
      name: 'Old Windmill',
      terrain: 'hillside',
      description: 'Perched atop a small hill, the skeletal remains of an old windmill overlook the fields. Its weathered blades creak in the breeze, a lonely silhouette against the setting sun.',
      exits: {
        n: '${self:map.eldenfortCountryside.rooms.westernFields}',
      },
    },
    easternFields: {
      name: 'Eastern Fields',
      terrain: 'fields',
      description: 'To the east, patches of cultivated land host a variety of crops. The tender care of the local farmers is evident in the neat rows and the healthy gleam of the produce.',
      exits: {
        n: '${self:map.eldenfortCountryside.rooms.brooksidePathEast}',
        e: '${self:map.eldenfortCountryside.rooms.orchards}',
        se: '${self:map.eldenfortCountryside.rooms.abandonedCottage}',
      },
    },
    orchards: {
      name: 'Fruit Orchards',
      terrain: 'orchard',
      description: 'Bountiful orchards laden with ripening fruits sprawl out here. The sweet fragrance of apples and peaches fills the air, and a soft hum of bees hard at work buzzes around.',
      exits: {
        w: '${self:map.eldenfortCountryside.rooms.easternFields}',
      },
    },
    abandonedCottage: {
      name: 'Abandoned Cottage',
      terrain: 'overgrown',
      description: 'Hidden amongst overgrown thickets, a small, forgotten cottage is slowly being reclaimed by nature. Its moss-covered stones and ivy-draped windows whisper stories of forgotten times.',
      exits: {
        nw: '${self:map.eldenfortCountryside.rooms.easternFields}',
      },
    },
    farmsteads: {
      name: 'Farmsteads',
      terrain: 'farmland',
      description: 'Several modest farmsteads dot the land here. Farmers tend to their fields, and the occasional sound of livestock punctuates the air. The farmsteads form a small community, linked to each other by worn paths.',
      exits: {
        nw: '${self:map.eldenfortCountryside.rooms.openFields}',
        s: '${self:map.eldenfortCountryside.rooms.southRoad}',
        sw: '${self:map.eldenfortCountryside.rooms.rollingHills}',
      },
    },
    southRoad: {
      name: 'South Road',
      terrain: 'packed dirt road',
      description: "This well-trodden road is the main artery through the southern expanse of the countryside. It's a popular route for merchants and travelers making their way between the farms and Eldenfort.",
      exits: {
        n: '${self:map.eldenfortCountryside.rooms.farmsteads}',
        w: '${self:map.eldenfortCountryside.rooms.rollingHills}',
        s: '${self:map.eldenfortCountryside.rooms.crossroads}',
      },
    },
    rollingHills: {
      name: 'Rolling Hills',
      terrain: 'grassy hills',
      description: "The land rises and falls gently here, forming rolling hills that offer spectacular views of the countryside. The wind is stronger, carrying the distant echo of Eldenfort's ancient bells.",
      exits: {
        ne: '${self:map.eldenfortCountryside.rooms.farmsteads}',
        e: '${self:map.eldenfortCountryside.rooms.southRoad}',
        se: '${self:map.eldenfortCountryside.rooms.crossroads}',
      },
    },
    crossroads: {
      name: 'Countryside Crossroads',
      terrain: '${self:map.eldenfortCountryside.rooms.crossroads}',
      description: 'At the heart of the countryside, a venerable oak stands guard at the crossroads. Here, paths from all directions converge, each leading to different facets of rural life.',
      exits: {
        n: '${self:map.eldenfortCountryside.rooms.southRoad}',
        nw: '${self:map.eldenfortCountryside.rooms.rollingHills}',
        ne: '${self:map.eldenfortCountryside.rooms.sunflowerFields}',
        sw: '${self:map.eldenfortCountryside.rooms.ancientRuins}',
        e: '${self:map.eldenfortCountryside.rooms.lavenderFields}',
      },
    },
    sunflowerFields: {
      name: 'Sunflower Fields',
      terrain: 'sunflower fields',
      description: 'The road diverges into an expanse of vibrant sunflower fields. These towering blooms turn their faces to follow the sun’s path across the sky, a golden sea of petals.',
      exits: {
        sw: '${self:map.eldenfortCountryside.rooms.crossroads}',
      },
    },
    lavenderFields: {
      name: 'Lavender Fields',
      terrain: 'lavender fields',
      description: 'The sweet and calming scent of lavender permeates the air here. Rows upon rows of purple stretch towards the horizon, creating a soothing purple tapestry that hums with busy bees.',
      exits: {
        w: '${self:map.eldenfortCountryside.rooms.crossroads}',
        s: '${self:map.eldenfortCountryside.rooms.hermitHaven}',
      },
    },
    hermitHaven: {
      name: 'Hermit’s Haven',
      terrain: 'secluded',
      description: 'Tucked away in the embrace of the lavender fields lies a small hermitage. This place of solitude is home to an old sage, rumored to be a keeper of ancient knowledge and stories of Eldenfort.',
      exits: {
        n: '${self:map.eldenfortCountryside.rooms.lavenderFields}',
      },
    },
    ancientRuins: {
      name: 'Ancient Ruins',
      terrain: 'ruins',
      description: 'Crumbling columns and arches are all that remain of what might have been a grand structure. These ancient ruins serve as a mute reminder of the impermanence of even the greatest of civilizations.',
      exits: {
        ne: '${self:map.eldenfortCountryside.rooms.crossroads}',
      },
    },
  },
  spawns: [
    { num: 1, max: 3, units: ['${self:creature.bandit}'] },
  ],
};
