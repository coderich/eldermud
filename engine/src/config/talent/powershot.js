module.exports = {
  cost: 10,
  code: 'psho',
  name: 'PowerShot',
  description: 'Focus a blistering arrow with increased damage and critical chance',
  gesture: '{actor.name} {focus} a magic arrow at {target.name}...',
  range: 5,
  speed: 1500,
  cooldown: 10000,
  target: 'other',
  stream: 'action',
  effects: [
    {
      style: 'hit',
      target: 'target',
      strike: {
        range: 5,
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
