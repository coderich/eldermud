const start = {
  room: '${self:map.start.rooms.start}',
  checkpoint: '${self:map.start.rooms.start}',
};

const hermit = {
  room: '${self:map.eldenfortCountryside.rooms.hermitHaven}',
  checkpoint: '${self:map.eldenfortCountryside.rooms.hermitHaven}',
};

module.exports = {
  ...start,
  posture: 'rest',
  lvl: 1,
  exp: 0,
  str: 1,
  dex: 1,
  int: 1,
  wis: 1,
  con: 1,
  cha: 1,
  traits: [
    '${self:trait.lifeforce}',
    '${self:trait.manaforce}',
  ],
  talents: [],
  attacks: ['${self:attack.fist}'],
};
