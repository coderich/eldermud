module.exports = {
  name: 'Training Grounds',
  description: 'A broad, open area partitioned into nine distinct zones for different training exercises. At the center lies The Pit, a makeshift arena for battle practice.',
  rooms: {
    warmUpField: {
      name: 'Warm-Up Field',
      terrain: 'grass',
      description: 'A soft, grassy patch marked with cones where recruits perform stretching and light exercises.',
      exits: {
        e: '${self:map.eldenfort.rooms.archeryRange}',
        s: '${self:map.eldenfort.rooms.shieldDrill}',
        se: '${self:map.eldenfort.rooms.pit}',
      },
    },

    archeryRange: {
      name: 'Archery Range',
      terrain: 'dirt',
      description: 'A straight range with straw targets set at various distances, ideal for practicing bows and throwing knives.',
      exits: {
        n: '${self:map.eldenfort.rooms.chapelRoad}',
        w: '${self:map.eldenfort.rooms.warmUpField}',
        e: '${self:map.eldenfort.rooms.footworkArena}',
        s: '${self:map.eldenfort.rooms.pit}',
      },
    },

    footworkArena: {
      name: 'Footwork Arena',
      terrain: 'sand',
      description: 'A sandy clearing with chalked grid lines for movement drills and agility training.',
      exits: {
        w: '${self:map.eldenfort.rooms.archeryRange}',
        s: '${self:map.eldenfort.rooms.swordRow}',
        sw: '${self:map.eldenfort.rooms.pit}',
      },
    },

    shieldDrill: {
      name: 'Shield Drill Station',
      terrain: 'grass',
      description: 'An area with wooden dummies and shield targets for practicing blocking and shield bashes.',
      exits: {
        n: '${self:map.eldenfort.rooms.warmUpField}',
        e: '${self:map.eldenfort.rooms.pit}',
        s: '${self:map.eldenfort.rooms.hurdleCourseStart}',
      },
    },

    pit: {
      name: 'The Pit',
      terrain: 'stone',
      description: 'A makeshift arena ringed by rough-hewn logs, where recruits test their combat skills in sparring matches.',
      exits: {
        n: '${self:map.eldenfort.rooms.archeryRange}',
        ne: '${self:map.eldenfort.rooms.footworkArena}',
        e: '${self:map.eldenfort.rooms.swordRow}',
        se: '${self:map.eldenfort.rooms.finalSprint}',
        s: '${self:map.eldenfort.rooms.agilityStation}',
        sw: '${self:map.eldenfort.rooms.hurdleCourseStart}',
        w: '${self:map.eldenfort.rooms.shieldDrill}',
        nw: '${self:map.eldenfort.rooms.warmUpField}',
      },
    },

    swordRow: {
      name: 'Sword Drill Row',
      terrain: 'grass',
      description: 'A line of practice dummies and torso targets for working on sword strikes and slashes.',
      exits: {
        n: '${self:map.eldenfort.rooms.footworkArena}',
        w: '${self:map.eldenfort.rooms.pit}',
        s: '${self:map.eldenfort.rooms.finalSprint}',
      },
    },

    hurdleCourseStart: {
      name: 'Hurdle Course Entrance',
      terrain: 'wood',
      description: 'The beginning of an obstacle course with low walls to vault over and beams to balance upon.',
      exits: {
        n: '${self:map.eldenfort.rooms.shieldDrill}',
        e: '${self:map.eldenfort.rooms.agilityStation}',
        ne: '${self:map.eldenfort.rooms.pit}',
      },
    },

    agilityStation: {
      name: 'Agility Station',
      terrain: 'wood',
      description: 'A mid-course checkpoint featuring rope climbs and agility poles for balance and coordination.',
      exits: {
        n: '${self:map.eldenfort.rooms.pit}',
        w: '${self:map.eldenfort.rooms.hurdleCourseStart}',
        e: '${self:map.eldenfort.rooms.finalSprint}',
      },
    },

    finalSprint: {
      name: 'Final Sprint',
      terrain: 'wood',
      description: 'The end of the obstacle course, a sprint through hanging nets and over tire stacks to test speed and endurance.',
      exits: {
        n: '${self:map.eldenfort.rooms.swordRow}',
        w: '${self:map.eldenfort.rooms.agilityStation}',
        nw: '${self:map.eldenfort.rooms.pit}',
      },
    },
  },
};
