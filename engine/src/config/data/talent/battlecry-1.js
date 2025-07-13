module.exports = {
  name: 'BattleCry',
  description: 'rally allies, granting +2 STR for 10s, costs 5 MP',
  code: 'bcry',
  cost: 5,
  target: 'none',
  effects: [
    { type: 'buff', target: 'party', affect: { str: 2, dex: 1 }, duration: 10000 },
    { type: 'debuff', target: 'enemies', affect: { str: -2, dex: -1 }, duration: 10000 },
    { type: 'perform', target: 'idk', affect: 'stun', args: [2000] },
  ],
};
