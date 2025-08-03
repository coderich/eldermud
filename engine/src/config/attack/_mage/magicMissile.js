module.exports = {
  name: 'MagicMissile',
  dmg: '2d6',
  speed: 2000,
  acc: 10,
  crits: 0,
  range: 5,
  cost: { ma: -5 },
  scale: { int: 1, wis: 0.3 },
  hits: ['scratch', 'rip', 'dig', 'tear'],
  misses: ['swipe', 'swing', 'paw'],
};
