module.exports = {
  code: 'stab',
  name: 'QuickStab',
  description: 'Quickly strike your opponent with increased critical chance',
  message: '{actor.name} quickly {sidestep} {target.name}...',
  style: 'gesture',
  speed: 500,
  cooldown: 10000,
  target: 'unit:$>',
  affect: { ma: -5 },
  pipeline: [
    {
      target: 'target',
      action: 'attack',
      stream: 'action',
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
  ],
};
