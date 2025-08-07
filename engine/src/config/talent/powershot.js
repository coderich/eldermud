module.exports = {
  code: 'psho',
  name: 'PowerShot',
  description: 'Focus a blistering arrow with increased damage and critical chance',
  cost: 10,
  // range: 5,
  speed: 1500,
  target: 'other',
  stream: 'action',
  style: 'gesture',
  cooldown: 10000,
  message: '{actor.name} {focus} a blistering arrow...',
  effects: [
    { style: 'hit', target: 'target', strike: { acc: 1000, crits: 1000, dmg: '1d10+3', range: 5, hits: ['pierce'], misses: ['swoosh'] } },
  ],
};
