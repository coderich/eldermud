const Unit = require('./Unit');

module.exports = class Creature extends Unit {
  constructor(data) {
    super(data);
    this.type = 'creature';

    SYSTEM.on(`enter:${data.room}`, ({ actor }) => {
      if (actor.type === 'player') {
        actor.once('post:move', () => this.streams.action.abort());
        this.stream('action', 'attack', { target: actor });
      }
    });
  }
};
