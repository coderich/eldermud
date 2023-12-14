SYSTEM.on('post:move', async ({ actor, promise }) => {
  const jester = CONFIG.get('npc.jester');

  if (promise.aborted) {
    if (`${jester.room}` === await REDIS.get(`${actor}.room`)) {
      actor.socket.emit('text', APP.styleText('Jester laughs at you!', 'gesture'));
    }
  }
});

module.exports = {
  name: 'Jester',
  map: '${self:map.void}',
  room: '${self:map.void.rooms.void}',
};