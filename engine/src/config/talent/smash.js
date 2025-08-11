module.exports = {
  cost: 10,
  code: 'smas',
  name: 'Smash',
  description: 'Deliver a crushing blow that deals damage and stuns',
  gesture: '{actor.name} {charge} {target.name}...',
  speed: 1000,
  cooldown: 20000,
  target: 'target',
  stream: 'action',
  effects: [
    {
      target: 'target',
      strike: {
        range: 1,
        acc: 1000,
        crits: 10,
        recoil: 1500,
        dmg: '2d8+3',
        hits: ['bash', 'smash', 'pummel'],
        misses: ['miss'],
        scale: { str: 0.50 },
      },
    },
  ],
};
