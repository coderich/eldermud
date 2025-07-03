module.exports = {
  name: 'Arbalest',
  depiction: 'A hefty war crossbow reinforced with metal braces and equipped with a windlass for high draw tension.',
  description: 'A war-grade mechanical launcher delivering devastating bolt velocity at the cost of slower reload time.',
  dmg: '3d8',
  acc: 3,
  crits: 1,
  range: 8,
  scale: { str: 0.8, dex: 0.2 },
  hits: ['shatter', 'impale', 'splinter'],
  misses: ['jam', 'stuck', 'misfire'],
};
