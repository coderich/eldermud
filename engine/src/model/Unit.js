const { Actor, Stream } = require('@coderich/gameflow');

module.exports = class Unit extends Actor {
  constructor(data) {
    super();
    Object.assign(this, data);
    this.streams = ['navigation', 'action', 'default'].reduce((prev, curr) => Object.assign(prev, { [curr]: new Stream(curr) }), {});
  }
};
