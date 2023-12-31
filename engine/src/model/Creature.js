const Unit = require('./Unit');

module.exports = class Creature extends Unit {
  constructor(data) {
    super(data);

    SYSTEM.on(`enter:${data.room}`, ({ actor }) => {
      if (actor !== this) {
        actor.once('post:move', () => this.streams.attack.abort());
        this.stream('action', 'attack', { target: actor });
      }
    });
  }
};
