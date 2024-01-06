const Unit = require('./Unit');

module.exports = class Player extends Unit {
  constructor(data) {
    super(data);
    this.type = 'player';
    this.toString = () => `player.${this.id}`; // REDIS key
    this.attacks = [{ dmg: '2d10' }];
  }
};
