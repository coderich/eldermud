const Actor = require('./Actor');

module.exports = class Creature extends Actor {
  constructor(data) {
    super(data);

    SYSTEM.on(`enter:${data.room}`, ({ actor }) => {
      if (actor.type === 'player') {
        actor.once('post:move', () => this.streams.action.abort());
        this.stream('action', 'attack', { target: actor });
      }
    });
  }
};
