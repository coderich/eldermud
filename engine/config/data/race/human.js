module.exports = {
  name: 'Human',
  depiction: 'A versatile and ambitious individual, adaptable to any challenge.',
  description: 'Humans are resilient and inventive, able to excel in a variety of roles thanks to their adaptability and intrepid spirit.',
  str: 0,
  dex: 0,
  int: 0,
  wis: 0,
  con: 0,
  cha: 0,
  gains: { str: 1, dex: 1, int: 1, wis: 1, con: 1, cha: 1 },
  traits: [
    // '${self:trait.adaptable}', // passive: once per day, reassign your free level-up point to a different stat
  ],
  talents: [
    // '${self:talent.jackOfAllTrades}', // active: gain +1 to all core stats for 10s, costs 5 MP, 60s cooldown
  ],
};
