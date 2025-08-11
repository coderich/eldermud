module.exports = {
  cost: 5,
  code: 'mihe',
  name: 'MinorHeal',
  description: 'Heal minor wounds',
  style: 'buff',
  target: 'ally',
  stream: 'action',
  cooldown: 5000,
  effects: [
    {
      style: 'buff',
      target: 'target',
      affect: { hp: '1d8+2' },
      message: '{actor.name} {heal} {target.name} of minor wounds',
    },
  ],
  upgrade: {
    cost: 1000,
    next: '${self:talent.heal-2}',
  },
};
