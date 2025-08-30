module.exports = {
  code: 'feys',
  name: 'FeyStep',
  target: 'self',
  description: 'Move blindingly fast with increased dexterity',
  cooldown: 60000,
  affect: { ma: -5 },
  pipeline: [
    {
      action: 'effect',
      target: 'target',
      style: 'buff',
      status: 'buffed',
      duration: 30000,
      effect: { dex: 10, moveSpeed: -500 },
      message: 'You feel fast!',
      cooloff: 'You slow down',
    },
  ],
};
