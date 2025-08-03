module.exports = {
  code: 'mihe',
  name: 'MinorHeal',
  description: 'Heal minor wounds',
  cost: 5,
  style: 'buff',
  target: 'ally',
  stream: 'action',
  cooldown: 5000,
  // gesture: 'focus mind in prayer',
  message: 'cast minorheal on',
  effects: [
    { style: 'buff', target: 'target', affect: { hp: '1d8+2' } },
  ],
  upgrade: {
    cost: 1000,
    next: '${self:talent.heal-2}',
  },
};
