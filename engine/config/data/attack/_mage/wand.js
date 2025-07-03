module.exports = {
  name: 'Wand',
  depiction: 'A slender rod of polished wood etched with faint arcane runes along its length.',
  description: 'A slender rod that channels and refines magical energy, allowing minor control over arcane diciplines.',
  dmg: '1d6',
  acc: 3,
  crits: 0,
  range: 4,
  scale: { int: 0.7, dex: 0.3 },
  hits: ['zap', 'spark', 'ignite'],
  misses: ['fizzle', 'misfire', 'spark fizzle'],
};
