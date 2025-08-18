module.exports = {
  code: 'char',
  name: 'Charge',
  description: 'Charge an opponent with a crushing blow that deals damage and stuns',
  message: '{actor.name} {charge} {target.name}...',
  style: 'gesture',
  speed: 1000,
  cooldown: 20000,
  target: 'unit:$>',
  affect: { ma: -5 },
  effects: [
    {
      target: 'target',
      action: {
        attack: {
          strike: {
            range: 1,
            acc: 1000,
            crits: 10,
            recoil: 1500,
            dmg: '2d8+3',
            hits: ['bash', 'smash', 'pummel', 'charge'],
            misses: ['miss'],
            scale: { str: 0.50 },
          },
        },
      },
    },
    {
      target: 'target',
      action: {
        stun: {
          duration: 2500,
        },
      },
    },
  ],
};
