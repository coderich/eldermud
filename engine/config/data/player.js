const purgatory = {
  room: '${self:map.purgatory.rooms.purgatory}',
};

const hermit = {
  room: '${self:map.eldenfortCountryside.rooms.hermitHaven}',
};

module.exports = {
  ...purgatory,
  posture: 'rest',
  deathpoint: '${self:map.purgatory.rooms.purgatory}',
  checkpoint: '${self:map.eldenfortSanatorium.rooms.triageRoom}',
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
