module.exports = {
  name: 'cat',
  pri: 'dex',
  str: 3,
  dex: 2,
  int: 1,
  wis: 0,
  con: 1,
  cha: 1,
  exp: 1,
  lvl: 1,
  depiction: 'A sleek, agile feline with piercing eyes, a coat of midnight black fur, and graceful movements that exude a sense of mystery and cunning',
  slain: 'The life force fades from the feline\'s eyes, and its once vibrant spirit succumbs to the eternal slumber.',
  random: {
    impressions: ['scraggly', 'fat', 'lazy'],
    movements: ['sneak'],
  },
  traits: [
    '${self:trait.domestic}',
    '${self:trait.lifeforce}',
    '${self:trait.vagabond}',
    '${self:trait.territorial}',
  ],
  attacks: [
    '${self:attack.claw}',
    '${self:attack.teeth}',
  ],
};
