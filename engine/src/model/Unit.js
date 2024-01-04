const { Actor, Stream } = require('@coderich/gameflow');

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
      realm: new Stream(),
      voice: new Stream(),
      sight: new Stream(),
      sound: new Stream(),
      scent: new Stream(),
      touch: new Stream(),
      action: new Stream(),
      preAction: new Stream(),
      telepath: new Stream(),
    };
  }

  send(...args) {
    return this.socket.emit(...args);
  }

  // async broadcast() {

  // }

  dispose() {
    return this;
  }

  stream(stream, ...args) {
    if (!(stream instanceof Stream)) stream = this.streams[stream];
    return super.stream(stream, ...args);
  }
};
