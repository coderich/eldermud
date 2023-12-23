const Unit = require('./Unit');

module.exports = class Creature extends Unit {
  constructor(data) {
    super(data);

    SYSTEM.on(`enter:${data.room}`, (context) => {
      if (context.actor !== this) {

      }
    });
  }
};
