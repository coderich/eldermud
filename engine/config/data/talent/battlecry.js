module.exports = {
  name: 'BattleCry',
  description: 'rally allies, granting +2 STR for 10s, costs 5 MP',
  cost: 5,
  effects: [
    { type: 'buff', target: 'party', affect: { str: 2 }, duration: 10000 },
  ],
};
