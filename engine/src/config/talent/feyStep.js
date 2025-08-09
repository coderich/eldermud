module.exports = {
  code: 'feys',
  name: 'FeyStep',
  description: 'Move blindingly fast with increased dexterity',
  message: '{actor.name} {move} much faster!',
  cost: 10,
  target: 'self',
  style: 'buff',
  cooldown: 60000,
  effects: [
    {
      style: 'buff',
      target: 'target',
      effect: { dex: 10, moveSpeed: -500 },
      duration: 20000,
      status: 'buffed',
    },
  ],
};
