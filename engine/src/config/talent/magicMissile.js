module.exports = {
  code: 'mmis',
  name: 'MagicMissile',
  description: 'Fire concentrated arcane bolts at your target',
  cost: 5,
  range: 5,
  speed: 1000,
  cooldown: 5000,
  target: 'other',
  stream: 'action',
  gesture: '{actor.name} {focus} an arcane bolt...',
  effects: [
    {
      style: 'hit',
      target: 'target',
      strike: { acc: 1000, crits: 5, dmg: '2d8+3', range: 5, hits: ['blast'], misses: ['swoosh'] },
    },
  ],
};
