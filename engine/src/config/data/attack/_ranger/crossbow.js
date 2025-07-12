module.exports = {
  name: 'Crossbow',
  depiction: 'A stout wooden frame housing a horizontal prod, fitted with a winding mechanism and trigger.',
  description: 'A mechanical bow that fires bolts with high tension and precision, slower to reload but armor-piercing in impact.',
  dmg: '2d8',
  acc: 4,
  crits: 1,
  range: 7,
  speed: 2000,
  scale: { str: 0.6, dex: 0.4 },
  hits: ['pierce', 'impale', 'crack'],
  misses: ['jam', 'break', 'misfire'],
};
