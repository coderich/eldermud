const { Actor, Stream } = require('@coderich/gameflow');

module.exports = class Player extends Actor {
  constructor({ socket }) {
    super(socket.id);
    this.type = 'player';
    this.socket = socket;
    this.toString = () => `player.${this.id}`; // REDIS key
    this.streams = ['navigation', 'action', 'default'].reduce((prev, curr) => Object.assign(prev, { [curr]: new Stream(curr) }), {});
  }

  send(...args) {
    return this.socket.emit(...args);
  }

  // broadcast() {

  // }
};
