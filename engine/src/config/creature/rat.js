module.exports = {
  name: 'Rat',
  // depiction: 'A rogue human in worn leather armor, dagger at the belt and eyes sharp for an opportunity.',
  // description: 'Bandits roam wild roads and forests, ambushing travelers for coin and goods. Agile and cunning, they rely on stealth and quick strikes.',
  slain: 'The rat takes its final breath, succumbing to the inevitable grasp of mortality.',

  // Ability scores
  str: 2,
  dex: 4,
  int: 2,
  wis: 2,
  con: 5,
  cha: 1,

  // Combat parameters
  lvl: 1,
  exp: 8,

  // Random flavor tables for variety
  random: {
    impressions: ['small', 'giant', 'huge', 'fat', 'skinny', 'angry'],
    movements: ['creep', 'scuttle', 'wobble'],
  },

  attacks: [
    '${self:attack.claw}',
    '${self:attack.teeth}',
  ],

  traits: [
    '${self:trait.lifeforce}',
    '${self:trait.vagabond}',
    '${self:trait.territorial}',
  ],
};
