SYSTEM.on('greet:npc.dorian', async ({ actor }) => {
  await REDIS.incr(`${actor}.npc.dorian.greet`);

  actor.writeln(APP.styleBlockText([
    { text: 'traveler', style: 'keyword', limit: 1 },
    { text: 'here', style: 'keyword', limit: 1 },
  ], `
    Hello traveler.
    What brings you here?
    I always wondered what would happen here if I said here many times...
  `));
});

module.exports = {
  name: 'Dorian',
  map: '${self:map.town}',
  room: '${self:map.town.rooms.start}',
  description: 'This is Dorian.',
};
