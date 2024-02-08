module.exports = {
  name: 'Archmage',
  depiction: 'An ethereal figure clad in robes adorned with arcane symbols, surrounded by floating tomes and shimmering magical barriers.',
  description: 'The pinnacle of magical prowess, Archmages command the raw forces of the universe, bending reality to their will with spells that can shape lands, alter time, and peer into the unknown.',
  str: 8,
  dex: 12,
  int: 18,
  wis: 15,
  con: 10,
  cha: 13,
  attacks: ['${self:attack.archmageStaff}'],
  traits: [
    '${self:trait.lifeforce}',
    '${self:trait.manaforce}',
    // '${self:trait.innateArcana}',
    // '${self:trait.masterOfTheElements}',
    // '${self:trait.archmageAegis}',
  ],
  talents: [
    // '${self:talent.timeWeave}',
    // '${self:talent.etherealStep}',
    // '${self:talent.planarReach}',
  ],
};
