module.exports = {
  code: 'bles',
  name: 'Greater Bless',
  description: '',
  cost: 10,
  effects: [
    { type: 'buff', target: 'ally', affect: { wis: 10, dex: 10 }, duration: 25000 },
  ],
  upgrade: {
    cost: 1000,
    next: '${self:talent.bless-3}',
  },
};
