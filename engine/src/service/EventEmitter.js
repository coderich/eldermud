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

  offFunction(fn) {
    return this.eventNames().filter((eventName) => {
      return this.listeners(eventName).includes(fn);
    }).map(eventName => this.off(eventName, fn));
  }
};
