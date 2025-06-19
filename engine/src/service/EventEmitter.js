const EventEmitter = require('events');

module.exports = class Emitter extends EventEmitter {
  emit(event, ...args) {
    return Promise.all([
      ...this.rawListeners(event).map((wrapper) => {
        return Promise.resolve(wrapper(...args));
      }),
      ...this.rawListeners('*').map((wrapper) => {
        return Promise.resolve(wrapper(event, ...args));
      }),
    ]);
  }

  offFunction(...fns) {
    fns = fns.flat();
    this.eventNames().forEach(eventName => fns.forEach(fn => this.off(eventName, fn)));
    return this;
  }
};
