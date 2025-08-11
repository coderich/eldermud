module.exports = {
  cost: 10,
  code: 'stab',
  name: 'QuickStab',
  description: 'Quickly strike your opponent with increased critical chance',
  gesture: '{actor.name} quickly {sidestep} {target.name}...',
  speed: 500,
  cooldown: 10000,
  target: 'target',
  stream: 'action',
  effects: [
    {
      target: 'target',
      strike: {
        range: 5,
        acc: 1000,
        crits: 1000,
        recoil: 500,
        dmg: '2d8',
        hits: ['stab'],
        misses: ['stab'],
        scale: { str: 0.25, dex: 0.25 },
      },
    },
  ],
};
