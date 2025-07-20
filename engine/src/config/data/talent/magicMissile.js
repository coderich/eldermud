module.exports = {
  code: 'mmis',
  name: 'MagicMissile',
  description: 'Fire concentrated arcane bolts at your target',
  cost: 0,
  range: 5,
  speed: 0,
  cooldown: 10000,
  target: 'creature',
  effects: [
    {
      target: 'target',
      attack: '${self:attack.magicMissile}',
    },
  ],
};
