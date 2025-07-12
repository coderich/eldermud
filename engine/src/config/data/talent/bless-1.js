module.exports = {
  name: 'Bless',
  description: '',
  code: 'bles',
  cost: 5,
  effects: [
    { type: 'buff', target: 'ally', affect: { wis: 5, dex: 5 }, duration: 20000 },
  ],
  upgrade: {
    cost: 1000,
    next: '${self:talent.bless-2}',
  },
};
