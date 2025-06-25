module.exports = {
  name: 'Cleric',
  depiction: 'A devout champion of divine power, clad in simple vestments bearing holy symbols.',
  description: 'Clerics channel sacred energy to heal allies and smite foes, drawing strength from their faith and conviction.',
  str: 10,
  dex: 8,
  int: 8,
  wis: 12,
  con: 10,
  cha: 8,
  gains: { str: 1, dex: 0, int: 1, wis: 2, con: 0, cha: 1 },
  attacks: [
    '${self:attack.mace}',
  ],
  traits: [
    '${self:trait.devotist}',
  ],
  talents: [
    '${self:talent.heal}',
  ],
  progression: [
    'Templar ▶ shield bashes, holy retaliation, party auras',
    'Inquisitor ▶ ranged smites, anti-undead bonuses, judgment seals',
    'Death Priest ▶ dark blessings, sacrificial heals, curse-based utility',
  ],
};
