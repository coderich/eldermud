module.exports = {
  name: 'Cat',
  depiction: 'A sleek, agile feline with piercing eyes, a coat of midnight black fur, and graceful movements that exude a sense of mystery and cunning',
  slain: 'The life force fades from the feline\'s eyes, and its once vibrant spirit succumbs to the eternal slumber.',

  lvl: 1,
  exp: 10,
  str: 5,
  dex: 10,
  int: 5,
  wis: 5,
  con: 6,
  cha: 8,

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
