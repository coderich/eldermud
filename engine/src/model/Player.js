const Unit = require('./Unit');

module.exports = class Player extends Unit {
  constructor(data) {
    super(data);
    this.type = 'player';
    this.socket = data.socket;
    this.toString = () => `player.${this.id}`; // REDIS key
  }

  send(...args) {
    return this.socket.emit(...args);
  }

  // broadcast() {

  // }
};
