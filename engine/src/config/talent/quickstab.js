module.exports = {
  cost: 5,
  code: 'stab',
  name: 'QuickStab',
  description: 'Quickly strike your opponent with increased critical chance',
  gesture: '{actor.name} quickly {sidestep} {target.name}...',
  speed: 500,
  cooldown: 10000,
  target: 'target',
  effects: [
    {
      target: 'target',
      action: {
        attack: {
          strike: {
            range: 1,
            acc: 1000,
            crits: 10,
            recoil: 500,
            dmg: '2d8+3',
            hits: ['stab'],
            misses: ['stab'],
            scale: { str: 0.25, dex: 0.25 },
          },
        },
      },
    },
  ],
};
