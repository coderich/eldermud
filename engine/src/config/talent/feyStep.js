module.exports = {
  cost: 10,
  code: 'feys',
  name: 'FeyStep',
  target: 'self',
  description: 'Move blindingly fast with increased dexterity',
  cooldown: 60000,
  effects: [
    {
      style: 'buff',
      target: 'target',
      status: 'buffed',
      duration: 30000,
      effect: { dex: 10, moveSpeed: -500 },
      message: 'You feel fast!',
      cooloff: 'You slow down',
    },
  ],
};
