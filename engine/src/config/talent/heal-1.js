module.exports = {
  cost: 5,
  code: 'mihe',
  name: 'MinorHeal',
  description: 'Heal minor wounds',
  gesture: '{actor.name} {lay} hands on {target.name}...',
  speed: 500,
  cooldown: 10000,
  target: 'ally',
  stream: 'action',
  effects: [
    {
      style: 'buff',
      target: 'target',
      affect: { hp: '1d6+2' },
      message: '{target.name} recovers {affect.hp} health',
    },
  ],
  upgrade: {
    cost: 1000,
    next: '${self:talent.heal-2}',
  },
};
