module.exports = {
  cost: 5,
  code: 'bles',
  name: 'Bless',
  message: '{actor.name} {cast} bless on {target.name}',
  description: 'Bestoy a blessing upon you or an ally; increasing stats',
  style: 'buff',
  target: 'ally',
  cooldown: 10000,
  effects: [
    { style: 'buff', target: 'target', affect: { hp: 5 } },
    { style: 'buff', target: 'target', effect: { wis: 5, dex: 5 }, duration: 20000, status: 'buffed' },
  ],
  upgrade: {
    cost: 1000,
    next: '${self:talent.bless-2}',
  },
};
