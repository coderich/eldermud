module.exports = {
  name: 'Rogue',
  depiction: 'A nimble and cunning infiltrator, hooded and ready to strike from the shadows.',
  description: 'Rogues rely on stealth and guile, delivering precise, deadly blows before their foes even know they\'re there.',
  str: 8,
  dex: 12,
  int: 10,
  wis: 8,
  con: 8,
  cha: 8,
  gains: { str: 0, dex: 2, int: 1, wis: 0, con: 0, cha: 0 },
  armor: '${self:armor.rags}',
  weapon: '${self:attack.shiv}',
  traits: [
    '${self:trait.shadowdancer}',
  ],
  talents: [
    '${self:talent.quickstab}',
  ],
  progression: [
    'Assassin ▶ stealth, back-stab multipliers, poison blades',
    'Shadowblade ▶ short teleports, shade clones and shadow strikes',
    'Trickster ▶ traps, illusions, CC-heavy crowd control',
  ],
};
