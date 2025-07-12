module.exports = {
  name: 'Divine Bless',
  description: '',
  code: 'bles',
  cost: 20,
  effects: [
    { type: 'buff', target: 'ally', affect: { wis: 20, dex: 20 }, duration: 25000 },
  ],
};
