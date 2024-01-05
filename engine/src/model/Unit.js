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
      info: new Stream('info'),
      realm: new Stream('realm'),
      voice: new Stream('voice'),
      sight: new Stream('sight'),
      sound: new Stream('sound'),
      scent: new Stream('scent'),
      touch: new Stream('touch'),
      action: new Stream('action'),
      preAction: new Stream('preAction'),
      telepath: new Stream('telepath'),
    };
  }

  send(...args) {
    return this.socket.emit(...args);
  }

  // async broadcast() {
  // }

  async dispose() {
    this.removeAllListeners();
    Object.values(this.streams).forEach(stream => stream.removeAllListeners());
    CONFIG.get(await REDIS.get(`${this}.room`)).units.delete(this);
    const keys = await REDIS.keys(`${this}.*`);
    await REDIS.del(keys);
    delete this;
  }

  stream(stream, ...args) {
    if (!(stream instanceof Stream)) stream = this.streams[stream];
    return super.stream(stream, ...args);
  }
};
