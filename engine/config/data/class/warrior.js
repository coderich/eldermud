module.exports = {
  name: 'Warrior',
  depiction: 'A battle-hardened combatant clad in armor and wielding a sturdy weapon.',
  description: 'Warriors master physical combat through rigorous training and unyielding resolve, relying on strength and endurance to prevail.',
  str: 12,
  dex: 10,
  int: 8,
  wis: 8,
  con: 12,
  cha: 8,
  gains: { str: 3, dex: 1, int: 0, wis: 0, con: 1, cha: 0 },
  attacks: [
    '${self:attack.sword}',
  ],
  traits: [
    '${self:trait.weaponmaster}',
  ],
  talents: [
    '${self:talent.bash}',
  ],
  progression: [
    'Berserker ▶ trades defense for burst damage and Fury gains at low HP',
    'Paladin ▶ laid-on-hands heals, auras and holy smites',
    'Death Warrior ▶ necrotic leech attacks, sacrifices HP for raw power',
  ],
};
