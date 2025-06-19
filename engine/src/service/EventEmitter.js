const EventEmitter = require('events');

module.exports = class Emitter extends EventEmitter {
  emit(event, ...args) {
    return Promise.all([
      ...this.rawListeners(event).map((wrapper) => {
        const listener = wrapper.listener || wrapper; // Due to once() etc I think...
        return Promise.resolve(listener(...args));
      }),
      ...this.rawListeners('*').map((wrapper) => {
        const listener = wrapper.listener || wrapper; // Due to once() etc I think...
        return Promise.resolve(listener(event, ...args));
      }),
    ]);
  }

  offFunction(...fns) {
    fns = fns.flat();
    this.eventNames().forEach(eventName => fns.forEach(fn => this.off(eventName, fn)));
    return this;
  }
};
