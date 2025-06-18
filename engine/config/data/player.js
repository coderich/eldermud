module.exports = {
  room: '${self:map.eldenfortCountryside.rooms.hermitHaven}',
  checkpoint: '${self:map.eldenfortCountryside.rooms.hermitHaven}',
  posture: 'stand',
  lvl: 1,
  exp: 0,
  str: 0,
  dex: 0,
  int: 0,
  wis: 0,
  con: 0,
  cha: 0,
  traits: [
    '${self:trait.lifeforce}',
    '${self:trait.manaforce}',
  ],
  talents: [],
  attacks: ['${self:attack.fist}'],
};
