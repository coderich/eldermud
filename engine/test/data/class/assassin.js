module.exports = {
  name: 'Assassin',
  pri: 'dex',
  str: 8,
  dex: 12,
  int: 6,
  wis: 4,
  crit: 10,
  dodge: 10,
  talents: ['${self:talent.stab}'],
  traits: ['${self:trait.lifeforce}', '${self:trait.manaforce}'],
  attacks: ['${self:weapon.dagger}'],
  description: 'Assassins are stealthy killers, specializing in swift, silent takedowns. Armed with concealed weapons and agile movement, they excel at eliminating targets discreetly.',
};
