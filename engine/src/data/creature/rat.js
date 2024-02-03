module.exports = {
  name: 'rat',
  pri: 'str',
  str: 3,
  dex: 2,
  int: 1,
  wis: 0,
  exp: 1,
  lvl: 1,
  size: 1,
  stealth: '10d10',
  random: {
    impressions: ['small', 'giant', 'huge', 'fat', 'skinny', 'angry'],
    movements: ['creep', 'scuttle', 'wobble'],
  },
  traits: [
    '${self:trait.lifeforce}',
    '${self:trait.vagabond}',
    '${self:trait.territorial}',
  ],
  attacks: ['${self:attack.claw}', '${self:attack.teeth}'],
};
