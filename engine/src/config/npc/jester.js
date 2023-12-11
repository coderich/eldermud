SYSTEM.on('*', async (event, { actor }) => {
  switch (event) {
    case 'post:engine': case 'post:move': {
      if (`${CONFIG.get('npc.jester.room')}` === await REDIS.get(`${actor}.room`)) {
        actor.socket?.emit('text', 'Jester laughs at you!');
      }
      break;
    }
    default: {
      break;
    }
  }
});

module.exports = {
  name: 'Jester',
  map: '${self:map.town}',
  room: '${self:map.town.rooms.start}',
};
