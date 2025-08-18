module.exports = {
  code: 'mmis',
  name: 'MagicMissile',
  description: 'Fire concentrated arcane bolts at your target',
  message: '{actor.name} {focus} an arcane bolt at {target.name}...',
  style: 'gesture',
  // range: 5,
  cooldown: 10000,
  target: 'unit:$>',
  affect: { ma: -5 },
  effects: [
    {
      target: 'target',
      action: {
        attack: {
          strike: {
            // range: 5,
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
