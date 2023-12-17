// SYSTEM.on('pre:enter', async ({ actor }) => {
//   const npc = CONFIG.get('npc.dorian');
//   const noop = ({ promise, data }) => (data.name !== 'stand' ? promise.abort() : null);
//   const { emit } = actor.socket;

//   if (actor.type === 'player') {
//     if (`${npc.room}` === await REDIS.get(`${actor}.room`)) {
//       actor.on('pre:execute', noop);
//       actor.socket.emit = (e, msg) => (e === 'dorian' ? emit.call(actor.socket, 'text', msg) : null);
//       await actor.perform('rest');
//       actor.socket.emit('dorian', APP.styleText('Stand you fool.', 'gesture'));
//       actor.once('pre:stand', () => {
//         actor.off('pre:execute', noop);
//         actor.socket.emit = emit;
//       });
//       actor.once('post:stand', () => {
//         actor.socket.emit('text', 'Good. Now to figure this shit out.');
//       });
//     }
//   }
// });

SYSTEM.on('greet:npc.dorian', async ({ actor }) => {
  await REDIS.incr(`${actor}.npc.dorian.greet`);

  actor.socket.emit('text', APP.styleBlockText(`
    Hello traveler.
    What brings you here?
    I always wondered what would happen here if I said here many times...
  `, [
    { text: 'traveler', style: 'keyword', limit: 1 },
    { text: 'here', style: 'keyword', limit: 1 },
  ]));
});

module.exports = {
  name: 'Dorian',
  map: '${self:map.town}',
  room: '${self:map.town.rooms.start}',
  ask: async (args) => {
    // console.log(subject);
  },
};
