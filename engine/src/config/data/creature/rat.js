module.exports = {
  name: 'rat',
  pri: 'str',
  str: 3,
  dex: 2,
  int: 1,
  wis: 0,
  con: 1,
  cha: 1,
  exp: 1,
  lvl: 1,
  slain: 'The rat takes its final breath, succumbing to the inevitable grasp of mortality.',
  random: {
    impressions: ['small', 'giant', 'huge', 'fat', 'skinny', 'angry'],
    movements: ['creep', 'scuttle', 'wobble'],
  },
  traits: [
    '${self:trait.lifeforce}',
    '${self:trait.vagabond}',
    '${self:trait.territorial}',
  ],
  attacks: [
    '${self:attack.claw}',
    '${self:attack.teeth}',
  ],
};
