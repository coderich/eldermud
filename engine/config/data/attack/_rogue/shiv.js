module.exports = {
  name: 'Shiv',
  depiction: 'A small, crudely sharpened blade with a chipped tip and a makeshift cloth-wrapped hilt.',
  description: 'An improvised dagger used for quick, stealthy attacks; light and easily concealed but fragile.',
  dmg: '1d4',
  acc: 3,
  crits: 1,
  range: 1,
  scale: { str: 0.2, dex: 0.6 },
  hits: ['cut', 'jab', 'scratch'],
  misses: ['slip', 'break', 'miss'],
};
