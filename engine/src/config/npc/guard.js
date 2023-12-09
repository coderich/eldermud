// const $self = prop => '${self:npc.guard.'.concat(prop, '}');

module.exports = {
  name: 'Guard',
  map: '${self:map.town}',
  room: '${self:map.town.rooms.room2}',
};
