const Actor = require('./Actor');

module.exports = class Player extends Actor {
  constructor(data) {
    super(data);
    this.type = 'player';
    this.toString = () => `player.${this.id}`; // REDIS key
    this.attacks = [{ dmg: '2d10' }];
  }
};
