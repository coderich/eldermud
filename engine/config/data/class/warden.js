module.exports = {
  name: 'Warden',
  depiction: 'A guardian of nature, clad in living bark and leaves, staff in hand.',
  description: 'Wardens stand as defenders of the wild, calling upon natural magic to entangle foes and bolster allies.',
  str: 8,
  dex: 8,
  int: 10,
  wis: 12,
  con: 10,
  cha: 8,
  gains: { str: 0, dex: 0, int: 1, wis: 2, con: 1, cha: 1 },
  traits: [
    '${self:trait.naturalist}',
  ],
  talents: [
    '${self:talent.entangle}',
  ],
  progression: [
    'Druid ▶ shape-shifting forms, healing over time, entangling roots',
    'Beastmaster ▶ permanent pet companion + call-to-arms buffs',
    'Sentinel ▶ static defensive wards, retaliatory thorns, crowd control',
  ],
};
