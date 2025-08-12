module.exports = {
  name: 'Orc',
  depiction: 'A hulking warrior with greenish skin, tusks protruding from a fierce maw, clad in rough but sturdy armor.',
  description: 'Orcs hail from harsh wastelands, renowned for their brutal strength, ferocity in battle, and enduring constitution.',
  str: 1,
  dex: 0,
  int: -1,
  wis: -1,
  con: 1,
  cha: -1,
  gains: { str: 1, dex: 0, int: 0, wis: 0, con: 1, cha: 0 },
  traits: [
    '${self:trait.bloodlust}',
  ],
  talents: [
    '${self:talent.primalRoar}',
  ],
};
