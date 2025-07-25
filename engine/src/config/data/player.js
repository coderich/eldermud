module.exports = {
  // room: '${self:map.purgatory.rooms.purgatory}',
  // deathpoint: '${self:map.purgatory.rooms.purgatory}',
  // checkpoint: '${self:map.eldenfortSanatorium.rooms.triageRoom}',

  room: '${self:map.eldenfortCountryside.rooms.hermitHaven}',
  deathpoint: '${self:map.eldenfortCountryside.rooms.hermitHaven}',
  checkpoint: '${self:map.eldenfortCountryside.rooms.hermitHaven}',

  lvl: 1,
  exp: 0,
  str: 1,
  dex: 1,
  int: 1,
  wis: 1,
  con: 1,
  cha: 1,
  stance: CONFIG.get('app.stance.ready'),
  traits: [
    '${self:trait.lifeforce}',
    '${self:trait.manaforce}',
  ],
  talents: [],
};
