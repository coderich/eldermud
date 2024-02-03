module.exports = {
  name: 'Shadowcaster',
  depiction: 'A cloaked figure standing in the dim light of dusk, eyes glowing faintly, as tendrils of darkness coil around their fingertips.',
  description: 'Masters of the dark arts, Shadowcasters tap into the chilling energies of the void to unleash curses and create spectral beings, thriving in the liminal space between life and death.',
  str: 9,
  dex: 11,
  int: 17,
  wis: 14,
  con: 12,
  cha: 14,
  attacks: ['${self:attack.shadowcasterSigil}'],
  traits: [
    '${self:trait.lifeforce}',
    '${self:trait.manaforce}',
    // '${self:trait.umbralAffinity}',
    // '${self:trait.curseWeaver}',
    // '${self:trait.nightStalker}',
  ],
  talents: [
    // '${self:talent.nightmareVisage}',
    // '${self:talent.shadowStep}',
    // '${self:talent.umbralChains}',
  ],
};
