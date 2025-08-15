module.exports = {
  cost: 5,
  code: 'roar',
  name: 'PrimalRoar',
  description: 'Unleash a thunderous roar that frightens nearby enemies and bolsters your ferocity',
  gesture: '{actor.name} {bellow} a thunderous roar!',
  target: 'self',
  speed: 100,
  cooldown: 30000,
  effects: [
    {
      target: 'self',
      style: 'debuff',
      status: 'buffed',
      effect: { str: 5, dex: 5 },
      duration: 15000,
      message: '{target.name} {become} enraged!',
    },
    // {
    //   type: 'debuff',
    //   target: 'enemies',
    //   effect: { str: -5, dex: -5 },
    //   duration: 15000,
    // },
  ],
};
