module.exports = {
  map: '${self:map.town}',
  room: '${self:map.town.rooms.start}',
  checkpoint: '${self:map.town.rooms.start}',
  posture: 'stand',
  attacks: [{ dmg: '2d10' }],
  traits: ['heartbeat'],
  hp: 20,
  mhp: 20,
  ma: 10,
  mma: 10,
  exp: 0,
};
