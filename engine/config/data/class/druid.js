module.exports = {
  name: 'Druid',
  depiction: 'A guardian of nature, clad in living bark and leaves, staff in hand.',
  description: 'Druids stand as defenders of the wild, calling upon natural magic to entangle foes and bolster allies.',
  str: 8,
  dex: 8,
  int: 10,
  wis: 10,
  con: 8,
  cha: 10,
  gains: { str: 0, dex: 0, int: 1, wis: 1, con: 0, cha: 1 },
  armor: '${self:armor.furs}',
  weapon: '${self:attack.stick}',
  traits: [
    '${self:trait.naturalist}',
  ],
  talents: [
    '${self:talent.thornWhip}',
  ],
  progression: [
    'Druid ▶ shape-shifting forms, healing over time, entangling roots',
    'Beastmaster ▶ permanent pet companion + call-to-arms buffs',
    'Sentinel ▶ static defensive wards, retaliatory thorns, crowd control',
  ],
};
