module.exports = {
  name: 'Guardsman',
  depiction: "A formidable guardsman in scuffed mail and tabard bearing the town's crest; wielding a spear in hand and a ring of keys/whistle at his belt.",
  description: 'Disciplined town guards, trained to hold lines with spear and shield, and to uphold law and order.',
  slain: 'The guardsman staggers as their tabard blooms dark; the spear slips from numb fingers as they collapse.',

  lvl: 5,
  exp: 100,
  str: 20,
  dex: 18,
  int: 10,
  wis: 10,
  con: 25,
  cha: 10,

  // Random flavor tables for variety
  random: {
    impressions: ['small', 'giant', 'huge', 'fat', 'skinny', 'angry'],
    movements: ['walk', 'strut', 'stride'],
  },

  attacks: [
    '${self:attack.spear}',
  ],

  traits: [
    '${self:trait.guardsman}',
  ],
};
