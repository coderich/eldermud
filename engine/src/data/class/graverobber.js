module.exports = {
  name: 'Grave Robber',
  pri: 'dex',
  str: 8,
  dex: 10,
  int: 6,
  wis: 6,
  crit: 0,
  dodge: 5,
  talents: ['${self:talent.loot}'],
  traits: ['${self:trait.lifeforce}', '${self:trait.manaforce}'],
  attacks: ['${self:weapon.dagger}'],
  description: 'Grave Robbers are agile scavengers, adept at finding valuable items and hidden treasures in the remains of the deceased.',
};
