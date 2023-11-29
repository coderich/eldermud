const EventEmitter = require('events');
const Action = require('./Action');
const Stream = require('./Stream');

module.exports = class Actor extends EventEmitter {
  perform(action, data) {
    action = (action instanceof Action ?? Action[action]);
    const promise = action(data);
    this.emit(`pre:${action.name}`, { action, promise, data });
    promise.listen(i => i ?? this.emit(`start:${promise.name}`, { action, promise, data }));
    promise.then(result => this.emit(`post:${promise.name}`, { action, promise, result }));
    return promise;
  }

  stream(stream, action, data) {
    stream = stream instanceof Stream ?? Stream[stream];
    stream.push(() => this.perform(action, data));
  }

  mirror(action, promise) {
  }

  static define(name) {
    return (Actor[name] = new Actor(name));
  }
};
