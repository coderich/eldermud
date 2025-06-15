module.exports = {
  name: 'Hero Training Grounds',
  description: 'A sprawling complex dedicated to transforming neophytes into specialized heroes, the Training Grounds are teeming with expert instructors, challenging obstacle courses, and the shouts and clangs of intense training. Each corner of the complex is designed to test and hone different heroic attributes: strength, agility, intelligence, and courage.',
  rooms: {
    entrancePlaza: {
      name: 'Entrance Plaza',
      terrain: 'cobblestone',
      description: 'The large open plaza is where the journey begins. Flanked by grand statues of legendary heroes, recruits are greeted by the Master of Training who assigns them their training path. The sunlight glistens on the polished cobblestone, and the banners of various factions flutter in the wind.',
      exits: {
        n: '${self:map.test1.rooms.strengthAlley}',
        e: '${self:map.test1.rooms.intelligenceAvenue}',
        s: '${self:map.test1.rooms.courageCourtyard}',
        w: '${self:map.test1.rooms.agilityLane}',
      },
    },
    strengthAlley: {
      name: 'Strength Alley',
      terrain: 'gravel',
      description: 'Lined with weightlifting stations, climbing ropes, and sparing rings, Strength Alley is where brawn is built. Trainees sweat and heave under the critical eyes of burly instructors as they push their limits. The sound of metal and the rhythmical breathing provide a unique symphony of power.',
      exits: {
        s: '${self:map.test1.rooms.entrancePlaza}',
        n: '${self:map.test1.rooms.barracks}',
      },
    },
    agilityLane: {
      name: 'Agility Lane',
      terrain: 'sand',
      description: 'A labyrinth of obstacle courses demanding precise movement and quick reflexes. Agile coaches dart through the courses, setting examples for trainees who navigate swinging logs, balance beams, and zip lines. The sandy terrain cushions falls, encouraging trainees to take risks and improve their dexterity.',
      exits: {
        e: '${self:map.test1.rooms.entrancePlaza}',
        w: '${self:map.test1.rooms.dormitory}',
      },
    },
    intelligenceAvenue: {
      name: 'Intelligence Avenue',
      terrain: 'marble',
      description: "Nestled with libraries, puzzle rooms, and alchemy labs, Intelligence Avenue is the brainchild of the realm's wisest. Trainees are seen studying ancient texts, solving intricate puzzles, and brewing complex concoctions, all under the mentorship of sage instructors versed in the arts of the mind.",
      exits: {
        w: '${self:map.test1.rooms.entrancePlaza}',
        e: '${self:map.test1.rooms.library}',
      },
    },
    courageCourtyard: {
      name: 'Courage Courtyard',
      terrain: 'stone',
      description: 'A hallowed space filled with haunted mazes, bravery tests, and moral quandaries. Here, trainees face their fears and learn valor. Sombre mentors guide the aspirants through psychological trials designed to fortify their spirits and steel their resolve.',
      exits: {
        n: '${self:map.test1.rooms.entrancePlaza}',
        s: '${self:map.test1.rooms.temple}',
      },
    },
    barracks: {
      name: 'Barracks',
      terrain: 'wood',
      description: "The massive barracks loom at the end of Strength Alley. Within its fortified walls, trainees recovering from the day's exertions rest and share tales of their progress. Well-deserved meals are consumed, and strategies for the following day are laid out as the warriors recharge for the challenges ahead.",
      exits: {
        s: '${self:map.test1.rooms.strengthAlley}',
      },
    },
    dormitory: {
      name: 'Dormitory',
      terrain: 'grass',
      description: "The lush green meadows by Agility Lane lead to the Dormitory, a serene place contrasted by the day's fast-paced challenges. Lithe figures stretch and perform intricate exercises, honing their flexibility as they discuss techniques and agility feats performed during the day's trials.",
      exits: {
        e: '${self:map.test1.rooms.agilityLane}',
      },
    },
    library: {
      name: 'Library',
      terrain: 'wood',
      description: 'The silent halls of the Library at the end of Intelligence Avenue house tomes of arcane knowledge. Trainees murmur in discussion or lose themselves in study, while the steady scratch of quills penning notes forms a quiet background hum. This sanctum is a wellspring of wisdom for those who seek to master their intellect.',
      exits: {
        w: '${self:map.test1.rooms.intelligenceAvenue}',
      },
    },
    temple: {
      name: 'Temple of Valor',
      terrain: 'marble',
      description: 'A glimmering marble edifice, the Temple of Valor marks the culmination of training at the Courage Courtyard. Flames flicker eternally at altars where heroes of yore are venerated. Trainees come here to pledge their valorous service, gaining blessings and taking oaths that will guide them through their warrior paths.',
      exits: {
        n: '${self:map.test1.rooms.courageCourtyard}',
      },
    },
  },
};
