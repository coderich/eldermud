module.exports = {
  name: 'Guard',
  map: '${self:map.town}',
  room: '${self:map.town.rooms.room2}',
  greet: async (_, { actor }) => {
    await REDIS.incr(`${actor}.npc.guard.greet`);
    actor.socket.emit('text', APP.styleBlockText(`
      Hello traveler.
      What brings you here?
      I always wondered what would happen here if I said here many times...
    `, [
      { text: 'traveler', style: 'keyword', limit: 1 },
      { text: 'here', style: 'keyword', limit: 1 },
    ]));
  },
  ask: async (args) => {
    // console.log(subject);
  },
};
