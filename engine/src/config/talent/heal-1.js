module.exports = {
  cost: 5,
  code: 'mihe',
  name: 'MinorHeal',
  description: 'Heal minor wounds',
  gesture: '{actor.name} {lay} hands on {target.name}...',
  speed: 500,
  cooldown: 10000,
  target: 'unit',
  effects: [
    {
      style: 'buff',
      target: 'target',
      affect: { hp: '2d4+2' },
      message: '{target.name} {recover} {affect.hp} health',
    },
  ],
  upgrade: {
    cost: 1000,
    next: '${self:talent.heal-2}',
  },
};
