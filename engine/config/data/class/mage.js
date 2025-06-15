module.exports = {
  name: 'Mage',
  depiction: 'A scholarly wielder of arcane energies, robes trailing runes of power.',
  description: 'Mages dedicate themselves to the study of the magical arts, using intellect and willpower to shape the fabric of reality with spells.',
  str: 8,
  dex: 8,
  int: 12,
  wis: 10,
  con: 8,
  cha: 8,
  gains: { str: 0, dex: 0, int: 3, wis: 2, con: 0, cha: 0 },
  attacks: [],
  traits: [
    '${self:trait.lifeforce}',
    '${self:trait.manaforce}',
    '${self:trait.arcanist}',
  ],
  talents: [
    '${self:talent.magicMissile}',
  ],
  progression: [
    'Elementalist ▶ fire/ice/lightning spells, area denial',
    'Enchanter ▶ buffs/debuffs, mana shields, crowd-control orbs',
    'Necromancer ▶ bone summons, corpse explosions, life-drain rituals',
  ],
};
