module.exports = {
  name: 'Hawkeye',
  depiction: 'A sleek recurve bow of dark wood, inscribed with fine lines and fitted with a precision sight.',
  description: 'A master-crafted bow named for its unparalleled precision, granting increased critical potential at extreme ranges.',
  dmg: '3d10',
  acc: 8,
  crits: 2,
  range: 10,
  speed: 2000,
  scale: { str: 0.4, dex: 0.6 },
  hits: ['pierce', 'slice', 'eye'],
  // misses: ['blunder', 'slip', 'fail'],
};
