module.exports = {
  code: 'psho',
  name: 'PowerShot',
  description: 'Focus a blistering arrow with increased damage and critical chance',
  message: '{actor.name} {focus} a magic arrow at {target.name}...',
  style: 'gesture',
  // range: 5,
  speed: 1500,
  cooldown: 10000,
  target: 'unit:$>',
  affect: { ma: -5 },
  pipeline: [
    {
      target: 'target',
      action: 'attack',
      stream: 'action',
      strike: {
        // range: 5,
        acc: 1000,
        crits: 1000,
        recoil: 1500,
        dmg: '2d8+3',
        hits: ['pierce'],
        misses: ['misfire'],
        scale: { str: 0.15, dex: 0.35 },
      },
    },
  ],
};
