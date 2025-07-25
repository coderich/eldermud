module.exports = {
  code: 'bash',
  name: 'Bash',
  description: 'Deliver a crushing blow that deals damage and stuns',
  cost: 5,
  style: 'debuff',
  target: 'target',
  speed: 1500,
  cooldown: 10000,
  gesture: 'raise weapon high',
  effects: [
    { style: 'hit', target: 'target', strike: { acc: 1000, crits: 10, dmg: '1d10+3', range: 1, hits: ['bash', 'smash', 'pummel'], misses: ['miss'] } },
  ],
};
