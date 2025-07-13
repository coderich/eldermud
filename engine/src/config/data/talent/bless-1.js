module.exports = {
  name: 'Bless',
  description: '',
  code: 'bles',
  cost: 5,
  range: 5,
  target: 'ally',
  // pipeline: [
  //   { type: 'actor', cmd: 'send', args: [] },
  //   { type: 'actor', cmd: 'broadcast', args: [] },
  //   { type: 'effect', target: 'target', affect: { wis: 5, dex: 5 }, duration: 20000 },
  // ],
  upgrade: {
    cost: 1000,
    next: '${self:talent.bless-2}',
  },
};
