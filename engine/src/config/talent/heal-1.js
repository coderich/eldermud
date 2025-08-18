module.exports = {
  // cost: 5,
  code: 'mihe',
  name: 'MinorHeal',
  affect: { ma: -5 },
  target: 'unit',
  description: 'Heal minor wounds',
  message: '{actor.name} {cast} MinorHeal on {target.name}!',
  style: 'gesture',
  cooldown: 10000,
  effects: [
    {
      style: 'buff',
      target: 'target',
      affect: { hp: '2d4+2' },
      message: 'You recover {affect.hp} health',
    },
  ],
  upgrade: {
    cost: 1000,
    next: '${self:talent.heal-2}',
  },
};
