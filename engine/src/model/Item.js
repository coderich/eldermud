const Actor = require('./Actor');

module.exports = class Item extends Actor {
  constructor(data) {
    super(data);
    this.type = 'item';
  }
};
