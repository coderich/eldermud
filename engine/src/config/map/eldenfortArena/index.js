module.exports = {
  name: 'Eldenfort Arena',
  description: 'A broad, open area partitioned into nine distinct zones for different training exercises. At the center lies The Pit, a makeshift arena for battle practice.',
  rooms: {
    pit: {
      name: 'The Pit',
      terrain: 'stone',
      description: 'A makeshift arena ringed by rough-hewn logs, where recruits test their combat skills in sparring matches.',
      exits: {
        u: '${self:map.eldenfort.rooms.archeryRange}',
        // n: '${self:map.eldenfort.rooms.archeryRange}',
        // ne: '${self:map.eldenfort.rooms.footworkArena}',
        // e: '${self:map.eldenfort.rooms.swordRow}',
        // se: '${self:map.eldenfort.rooms.finalSprint}',
        // s: '${self:map.eldenfort.rooms.agilityStation}',
        // sw: '${self:map.eldenfort.rooms.hurdleCourseStart}',
        // w: '${self:map.eldenfort.rooms.shieldDrill}',
        // nw: '${self:map.eldenfort.rooms.warmUpField}',
      },
    },
  },
  spawns: [
    { num: 1, max: 1, units: ['${self:creature.rat}'] },
  ],
};
