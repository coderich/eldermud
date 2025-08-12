module.exports = {
  cost: 5,
  code: 'roar',
  name: 'PrimalRoar',
  description: 'Unleash a thunderous roar that frightens nearby enemies and bolsters your ferocity',
  target: 'none',
  style: 'debuff',
  speed: 100,
  cooldown: 30000,
  effects: [
    { type: 'buff', target: 'self', effect: { str: 5, dex: 5 }, duration: 15000 },
    { type: 'debuff', target: 'enemies', effect: { str: -5, dex: -5 }, duration: 15000 },
  ],
};
