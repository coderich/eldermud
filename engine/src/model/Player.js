const Unit = require('./Unit');

module.exports = class Player extends Unit {
  constructor(data) {
    super(data);
    this.type = 'player'; // Because there is no config type for player
    this.toString = () => `player.${this.id}`; // REDIS key
  }
};
