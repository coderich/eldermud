module.exports = {
  cost: 10,
  code: 'feys',
  name: 'FeyStep',
  description: 'Move blindingly fast with increased dexterity',
  message: '{actor.name} {move} much faster!',
  target: 'self',
  style: 'buff',
  cooldown: 60000,
  effects: [
    {
      style: 'buff',
      target: 'target',
      status: 'buffed',
      effect: { dex: 10, moveSpeed: -500 },
      duration: 30000,
    },
  ],
};
