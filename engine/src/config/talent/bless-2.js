module.exports = {
  code: 'bles',
  name: 'Greater Bless',
  description: '',
  affect: { ma: -10 },
  upgrade: {
    cost: 1000,
    next: '${self:talent.bless-3}',
  },
};
