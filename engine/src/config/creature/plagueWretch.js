module.exports = {
  name: 'Plague Wretch',
  depiction: 'A hunched figure draped in tattered rags, pustules and sores crusting its skin. It emits a low, gurgling moan.',
  description: 'Once human, now twisted by the Plague. Its eyes are sunken, and its movements are erratic as it seeks fresh victims to spread disease.',
  str: 10,
  dex: 8,
  int: 3,
  wis: 4,
  con: 12,
  cha: 2,
  exp: 2,
  lvl: 1,
  size: 2,
  random: {
    ranks: ['Wretch', 'Rotting Husk', 'Plague Bearer'],
    impressions: ['Diseased', 'Malnourished', 'Pale', 'Reeking'],
    movements: ['Shuffle', 'Lurch', 'Stagger', 'Twitch'],
  },
  attacks: [
    '${self:attack.teeth}',
    '${self:attack.touch}',
  ],
  traits: [
    '${self:trait.territorial}',
    // '${self:trait.contagious}',
    // '${self:trait.frenzied}',
  ],
};
