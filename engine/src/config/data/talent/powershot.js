module.exports = {
  code: 'psho',
  name: 'PowerShot',
  description: 'Focus a blistering arrow with increased damage and critical chance',
  cost: 10,
  // range: 5,
  // speed: 2000,
  target: 'target',
  gesture: 'focus blistering arrow',
  effects: [
    { style: 'hit', target: 'target', strike: { acc: 1000, crits: 10, dmg: '1d10+3', range: 5, hits: ['pierce'], misses: ['swoosh'] } },
    // { style: 'hit', target: 'self', effect: { acc: 10, crits: 10, dmg: '1d10+1' }, duration: 10000 },
  ],
};
