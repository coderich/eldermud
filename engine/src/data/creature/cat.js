module.exports = {
  name: 'cat',
  pri: 'dex',
  str: 3,
  dex: 2,
  int: 1,
  wis: 0,
  exp: 1,
  lvl: 1,
  stealth: '10d10+50',
  depiction: 'A sleek, agile feline with piercing eyes, a coat of midnight black fur, and graceful movements that exude a sense of mystery and cunning',
  random: {
    impressions: ['scraggly', 'fat', 'lazy'],
    movements: ['sneak'],
  },
  traits: ['${self:trait.lifeforce}', '${self:trait.hunter}'],
  attacks: ['${self:weapon.claw}', '${self:weapon.teeth}'],
};
