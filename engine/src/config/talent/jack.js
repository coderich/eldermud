module.exports = {
  code: 'jack',
  name: 'JackOfTrades',
  description: 'Temporarily increase all stats',
  message: '{actor.name} {cast} JackOfTrades',
  style: 'buff',
  target: 'self',
  cooldown: 60000,
  affect: { ma: -5 },
  pipeline: [
    {
      action: 'effect',
      style: 'buff',
      target: 'target',
      status: 'buffed',
      duration: 30000,
      effect: { str: 5, int: 5, wis: 5, dex: 5, con: 5, cha: 5 },
    },
  ],
};
