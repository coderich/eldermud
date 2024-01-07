SYSTEM.on('post:move', async ({ actor, promise }) => {
  const jester = CONFIG.get('npc.jester');

  if (promise.aborted) {
    if (`${jester.room}` === await REDIS.get(`${actor}.room`)) {
      actor.send('text', APP.styleText('gesture', 'Jester laughs at you!'));
    }
  }
});

module.exports = {
  name: 'Jester',
  map: '${self:map.void}',
  room: '${self:map.void.rooms.void}',
};
