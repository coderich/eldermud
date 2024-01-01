const { Actor, Stream, Action } = require('@coderich/gameflow');

// Socket Stub
const socket = new Proxy({}, {
  get(target, method) {
    return () => null;
  },
});

module.exports = class Unit extends Actor {
  constructor(data) {
    super();
    Object.assign(this, data);
    this.socket ??= socket;

    // Streams
    this.streams = {
      info: new Stream(),
      voice: new Stream(),
      sight: new Stream(),
      sound: new Stream(),
      scent: new Stream(),
      touch: new Stream(),
      action: new Stream(),
      attack: new Stream(),
      telepath: new Stream(),
    };
  }

  dispose() {
    return this;
  }

  stream(stream, ...args) {
    if (!(stream instanceof Stream)) stream = this.streams[stream];
    return super.stream(stream, ...args);
  }

  // perform(action, data, context = {}) {
  //   if (!(action instanceof Action)) action = Action[action];

  //   if (context.stream === this.streams.action) {
  //     if (this.target) {
  //       console.log('aborting target');
  //       this.target.abort();
  //       delete this.target;
  //     }
  //   }

  //   const promise = super.perform(action, data, context);
  //   if (promise.id === 'attack') this.target = promise;
  //   return promise;
  // }
};
