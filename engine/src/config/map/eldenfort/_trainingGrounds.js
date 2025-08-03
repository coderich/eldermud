module.exports = {
  rooms: {
    warmUpField: {
      name: "Pit's Edge",
      description: 'A soft expanse of well-tended grass edged with low hedges—ideal for stretching and light warm-up routines while watching sparring below.',
      exits: {
        e: '${self:map.eldenfort.rooms.archeryRange}',
        s: '${self:map.eldenfort.rooms.shieldDrill}',
        se: '${self:map.eldenfortArena.rooms.pit}',
      },
    },

    archeryRange: {
      name: "Pit's Edge",
      description: 'An open archway flanked by trellised vines; the breeze carries the clatter of arrows from the Pit, yet here the air feels calm and cool.',
      exits: {
        n: '${self:map.eldenfort.rooms.chapelRoad}',
        w: '${self:map.eldenfort.rooms.warmUpField}',
        e: '${self:map.eldenfort.rooms.footworkArena}',
        s: '${self:map.eldenfortArena.rooms.pit}',
      },
    },

    footworkArena: {
      name: "Pit's Edge",
      description: 'A narrow sandy strip beneath the shade of latticework, where passersby can pause and observe footwork drills without stepping into the fray.',
      exits: {
        w: '${self:map.eldenfort.rooms.archeryRange}',
        s: '${self:map.eldenfort.rooms.swordRow}',
        sw: '${self:map.eldenfortArena.rooms.pit}',
      },
    },

    shieldDrill: {
      name: "Pit's Edge",
      description: 'A semicircle of stone benches under a carved pergola, offering a restful vantage point for shield drills and sparring matches alike.',
      exits: {
        n: '${self:map.eldenfort.rooms.warmUpField}',
        e: '${self:map.eldenfortArena.rooms.pit}',
        s: '${self:map.eldenfort.rooms.hurdleCourseStart}',
      },
    },

    // pit: {
    //   name: "Pit's Edge",

    //   description: 'A makeshift arena ringed by rough-hewn logs, where recruits test their combat skills in sparring matches.',
    //   exits: {
    //     n: '${self:map.eldenfort.rooms.archeryRange}',
    //     ne: '${self:map.eldenfort.rooms.footworkArena}',
    //     e: '${self:map.eldenfort.rooms.swordRow}',
    //     se: '${self:map.eldenfort.rooms.finalSprint}',
    //     s: '${self:map.eldenfort.rooms.agilityStation}',
    //     sw: '${self:map.eldenfort.rooms.hurdleCourseStart}',
    //     w: '${self:map.eldenfort.rooms.shieldDrill}',
    //     nw: '${self:map.eldenfort.rooms.warmUpField}',
    //   },
    //   spawns: [
    //     { num: 1, max: 3, units: ['${self:creature.rat}'] },
    //   ],
    // },

    swordRow: {
      name: "Pit's Edge",
      description: 'A terrace of flowering shrubs and clipped boxwood; a tranquil spot to test sword swings without distractions.',
      exits: {
        n: '${self:map.eldenfort.rooms.footworkArena}',
        w: '${self:map.eldenfortArena.rooms.pit}',
        s: '${self:map.eldenfort.rooms.finalSprint}',
      },
    },

    hurdleCourseStart: {
      name: "Pit's Edge",
      description: 'A covered arcade with wooden posts and climbing vines, marking the start of the obstacle path but providing shade and seating.',
      exits: {
        n: '${self:map.eldenfort.rooms.shieldDrill}',
        e: '${self:map.eldenfort.rooms.agilityStation}',
        ne: '${self:map.eldenfortArena.rooms.pit}',
      },
    },

    agilityStation: {
      name: "Pit's Edge",
      description: 'A small niche centered around a bubbling stone fountain; its gentle sound masks the clang of training, creating a calm pause.',
      exits: {
        n: '${self:map.eldenfortArena.rooms.pit}',
        w: '${self:map.eldenfort.rooms.hurdleCourseStart}',
        e: '${self:map.eldenfort.rooms.finalSprint}',
      },
    },

    finalSprint: {
      name: "Pit's Edge",
      description: 'A path lined with flowering planters and smooth stones, leading away from the Pit—here the air feels lighter, a signal of respite.',
      exits: {
        n: '${self:map.eldenfort.rooms.swordRow}',
        w: '${self:map.eldenfort.rooms.agilityStation}',
        nw: '${self:map.eldenfortArena.rooms.pit}',
      },
    },
  },
};
