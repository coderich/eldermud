module.exports = {
  name: 'Sanatorium',
  description: 'A forgotten hospice beneath the Chapel of Eldenfort, where the sick were brought to recover or die. Now, it is a place of silence, memory, and undeath.',
  backstory: `
    Once a center of mercy for the afflicted, the Sanatorium was built beneath the chapel to shield the healthy from the horrors of the Plague.
    Over time, it became less a place of healing and more a tomb. Wardens sealed its gates, prayers were whispered, and then forgotten.

    You awaken inside it, touched by the fever, yet alive. Something is different. You do not remember who you were.
    The answers lie within the depths - and your path forward begins with a choice of identity among the memories of the dead.
  `,
  rooms: {
    entryDoor: {
      name: 'Sealed Entry',
      terrain: 'underground',
      description: 'A heavy iron door, bolted shut from the outside. The walls are slick with condensation, and faded plague symbols are carved into the stone.',
      exits: {
        e: '${self:map.eldenfortSanatorium.rooms.sealedVestibule}',
        // w: '${self:map.eldenfortChapel.rooms.altar}',
      },
      // paths: {
      //   w: '${self:map.eldenfortSanatorium.doors.entryDoor}',
      // },
    },
    sealedVestibule: {
      name: 'Sealed Vestibule',
      terrain: 'underground',
      description: 'A narrow room lined with rusted sconces and cracked basins. The air carries a tang of herbs and old blood. Ash clings to the floor in swirling patches.',
      exits: {
        w: '${self:map.eldenfortSanatorium.rooms.entryDoor}',
        n: '${self:map.eldenfortSanatorium.rooms.intakeHall}',
      },
    },
    intakeHall: {
      name: 'Intake Hall',
      terrain: 'underground',
      description: 'Stone benches and broken clipboards litter the corridor. Wall-mounted hooks once held stretchers; now they hold only dust and old straps.',
      exits: {
        s: '${self:map.eldenfortSanatorium.rooms.sealedVestibule}',
        n: '${self:map.eldenfortSanatorium.rooms.morgue}',
        e: '${self:map.eldenfortSanatorium.rooms.wardingChamber}',
      },
    },
    morgue: {
      name: 'Morgue',
      terrain: 'underground',
      description: 'A long chamber of cold slabs, some empty, others veiled in stiff sheets. Iron grates in the floor suggest drainage. Shelves line the walls, holding jars of preserved remains.',
      exits: {
        s: '${self:map.eldenfortSanatorium.rooms.intakeHall}',
      },
    },
    wardingChamber: {
      name: 'Warding Chamber',
      terrain: 'underground',
      description: 'A circular room lit by a hanging brazier. Shards of crystal float midair, their edges faintly glowing. Runes circle the floor in faded chalk.',
      exits: {
        w: '${self:map.eldenfortSanatorium.rooms.intakeHall}',
        e: '${self:map.eldenfortSanatorium.rooms.centralHall}',
        n: '${self:map.eldenfortSanatorium.rooms.caldraRetreat}',
      },
    },
    caldraRetreat: {
      name: "Caldra's Retreat",
      terrain: 'underground',
      description: 'A low room warmed by a clay brazier. Herbs hang from overhead ropes, drying in the dim glow. A cot, a desk, and a shelf of scrolls suggest long habitation.',
      exits: {
        s: '${self:map.eldenfortSanatorium.rooms.wardingChamber}',
      },
    },
    centralHall: {
      name: 'Central Hall',
      terrain: 'underground',
      description: 'An arched corridor with cracked stonework and soot-streaked walls. Burnt-out torches and toppled benches hint at recent chaos.',
      exits: {
        w: '${self:map.eldenfortSanatorium.rooms.wardingChamber}',
        e: '${self:map.eldenfortSanatorium.rooms.triageRoom}',
        n: '${self:map.eldenfortSanatorium.rooms.collapsedWard}',
      },
    },
    triageRoom: {
      name: 'Triage Room',
      terrain: 'underground',
      description: 'Bloodstained tables and shattered medicine jars cover the floor. A curtain rail swings loosely from the ceiling, the fabric long gone.',
      exits: {
        w: '${self:map.eldenfortSanatorium.rooms.centralHall}',
        n: '${self:map.eldenfortSanatorium.rooms.quarantineHall}',
      },
    },
    quarantineHall: {
      name: 'Quarantine Hall',
      terrain: 'underground',
      description: 'A hallway of heavy cell doors, many sealed with rusted iron. A single viewing window is cracked but unbroken. Chains lie coiled near the baseboards.',
      exits: {
        s: '${self:map.eldenfortSanatorium.rooms.triageRoom}',
      },
    },
    collapsedWard: {
      name: 'Collapsed Ward',
      terrain: 'underground',
      description: 'Ceiling beams have snapped here, scattering stone and splinters. A toppled bed frame leans against the far wall, half-buried in rubble.',
      exits: {
        s: '${self:map.eldenfortSanatorium.rooms.centralHall}',
      },
    },
    // // Hidden/Secret below
    // crumblingTunnel: {
    //   name: 'Crumbling Tunnel',
    //   terrain: 'underground',
    //   description: 'A narrow, debris-strewn tunnel with sagging supports. Every step risks a collapse.',
    //   exits: {
    //     e: '${self:map.eldenfortSanatorium.rooms.hiddenFissure}',
    //   },
    // },
    // hiddenFissure: {
    //   name: 'Hidden Fissure',
    //   terrain: 'underground',
    //   description: 'A jagged tear in the rock emits a cold draft. Moss-covered stone gives way to open air.',
    //   exits: {
    //     w: '${self:map.eldenfortSanatorium.rooms.crumblingTunnel}',
    //     e: '${self:map.eldenfortSanatorium.rooms.surfaceBreach}',
    //   },
    // },
    // surfaceBreach: {
    //   name: 'Surface Breach',
    //   terrain: 'underground',
    //   description: 'Roots and earth spill through a collapsed ceiling. A sliver of daylight beckons from above - a rough but climbable exit.',
    //   exits: {
    //     w: '${self:map.eldenfortSanatorium.rooms.hiddenFissure}',
    //   },
    // },
  },
  // doors: {
  //   entryDoor: {
  //     name: 'South Gate of Eldenfort',
  //     depiction: 'A monumental structure that serves as the town\'s lifeblood. It is constructed from sturdy oak timbers, reinforced with iron bands, and adorned with intricate carvings that tell tales of the town\'s history. The gate is flanked by towering stone pillars, each bearing the crest of Eldenfort, and is surmounted by a grand archway that allows for the passage of wagons and mounted troops.',
  //     label: '${self:self:map.eldenfortSanatorium.doors.entryDoor.status} iron door',
  //     status: 'locked',
  //     durability: 100,
  //     picklock: 100,
  //     traits: ['${self:trait.door}'],
  //   },
  // },
};
