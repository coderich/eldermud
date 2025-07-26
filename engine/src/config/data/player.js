module.exports = {
  // room: '${self:map.purgatory.rooms.purgatory}',
  // deathpoint: '${self:map.purgatory.rooms.purgatory}',
  // checkpoint: '${self:map.eldenfortSanatorium.rooms.triageRoom}',

  room: '${self:map.eldenfortCountryside.rooms.hermitHaven}',
  deathpoint: '${self:map.eldenfortCountryside.rooms.hermitHaven}',
  checkpoint: '${self:map.eldenfortCountryside.rooms.hermitHaven}',

  lvl: 1,
  exp: 0,
  str: 0,
  dex: 0,
  int: 0,
  wis: 0,
  con: 0,
  cha: 0,
  gains: { str: 0, dex: 0, int: 0, wis: 0, con: 0, cha: 0 },
  stance: CONFIG.get('app.stance.ready'),
  armor: '${self:armor.cloth}',
  weapon: '${self:attack.fist}',
  traits: ['${self:trait.lifeforce}', '${self:trait.manaforce}'],
  talents: [],
};
