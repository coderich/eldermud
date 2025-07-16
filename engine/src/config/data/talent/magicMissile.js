module.exports = {
  code: 'mmis',
  name: 'MagicMissile',
  description: 'Fire concentrated arcane bolts at your target',
  cost: 0,
  range: 5,
  speed: 0,
  target: 'creature',
  // gesture: 'focus blistering arrow',
  effects: [
    {
      target: 'target',
      attack: '${self:attack.magicMissile}',
    },
  ],
};
