module.exports = {
  code: 'mihe',
  name: 'MinorHeal',
  target: 'unit',
  description: 'Heal minor wounds',
  message: '{actor.name} {cast} MinorHeal on {target.name}!',
  style: 'gesture',
  cooldown: 10000,
  affect: { ma: -5 },
  pipeline: [
    {
      style: 'buff',
      target: 'target',
      action: 'effect',
      affect: { hp: '2d4+2' },
      message: 'You recover {affect.hp} health',
    },
  ],
  upgrade: {
    cost: 1000,
    next: '${self:talent.heal-2}',
  },
};
