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

  mGet(...keys) {
    keys = keys.flat();
    return REDIS.mGet(keys.map(key => `${this}.${key}`)).then((values) => {
      return values.reduce((prev, value, i) => Object.assign(prev, { [keys[i]]: value }), {});
    });
  }

  send(event, message, ...rest) {
    if (rest.length) message = message.concat(rest.flat().join(''));
    return this.socket.emit(event, message);
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
