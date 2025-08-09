module.exports = {
  code: 'jack',
  name: 'JackOfTrades',
  description: 'Bestoy a blessing upon you or an ally; increasing stats',
  cost: 10,
  style: 'buff',
  target: 'self',
  cooldown: 60000,
  effects: [
    {
      style: 'buff',
      target: 'target',
      message: '{actor.name} {cast} JackOfTrades',
      effect: { str: 5, int: 5, wis: 5, dex: 5, con: 5, cha: 5 },
      duration: 30000,
      status: 'buffed',
    },
  ],
};
