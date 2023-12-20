SYSTEM.on('pre:enter', async ({ actor }) => {
  const npc = CONFIG.get('npc.dorian');

  if (actor.type === 'player') {
    if (`${npc.room}` === await REDIS.get(`${actor}.room`)) {
      await actor.perform('quest.signup');
      // actor.socket.emit('text', APP.styleText('Stand you fool.', 'gesture'));
      // await actor.perform('task.stand');
      // actor.socket.emit('text', 'Good. Now to figure this shit out.');
      // await actor.perform('rest');
      // actor.socket.emit('dorian', APP.styleText('Stand you fool.', 'gesture'));
      // actor.once('pre:stand', () => {
      //   actor.off('pre:execute', noop);
      //   actor.socket.emit = emit;
      // });
      // actor.once('post:stand', () => {
      //   actor.socket.emit('text', 'Good. Now to figure this shit out.');
      // });
    }
  }
});

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
