module.exports = {
  cost: 5,
  code: 'mmis',
  name: 'MagicMissile',
  description: 'Fire concentrated arcane bolts at your target',
  gesture: '{actor.name} {focus} an arcane bolt at {target.name}...',
  range: 5,
  cooldown: 10000,
  target: 'other',
  stream: 'action',
  effects: [
    {
      target: 'target',
      action: {
        attack: {
          strike: {
            range: 5,
            crits: 5,
            acc: 1000,
            speed: 1000,
            recoil: 1000,
            dmg: '2d8+3',
            hits: ['blast'],
            misses: ['misfire'],
            scale: { int: 0.35, wis: 0.15 },
          },
        },
      },
    },
  ],
};
