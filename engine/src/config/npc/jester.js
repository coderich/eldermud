SYSTEM.on('post:move', async ({ actor, promise }) => {
  const jester = CONFIG.get('npc.jester');

  if (promise.aborted) {
    if (`${jester.room}` === await REDIS.get(`${actor}.room`)) {
      actor.socket?.emit('text', APP.styleText("Jester laughs at you!", 'gesture'));
    }
  }
});
// SYSTEM.on('*', async (event, { actor }) => {
//   switch (event) {
//     case 'post:engine': case 'post:move': {
//       if (`${CONFIG.get('npc.jester.room')}` === await REDIS.get(`${actor}.room`)) {
//         actor.socket?.emit('text', 'Jester laughs at you!');
//       }
//       break;
//     }
//     default: {
//       break;
//     }
//   }
// });

module.exports = {
  name: 'Jester',
  map: '${self:map.town}',
  room: '${self:map.town.rooms.start}',
};
