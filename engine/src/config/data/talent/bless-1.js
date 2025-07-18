module.exports = {
  code: 'bles',
  name: 'Bless',
  description: '',
  cost: 5,
  range: 5,
  speed: 1000,
  target: 'ally',
  gesture: 'focus energy in prayer',
  effects: [
    { style: 'buff', target: 'target', effect: { wis: 5, dex: 5 }, duration: 20000 },
  ],
  upgrade: {
    cost: 1000,
    next: '${self:talent.bless-2}',
  },
};
