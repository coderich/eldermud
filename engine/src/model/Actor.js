const { Actor, Stream } = require('@coderich/gameflow');

// Socket Stub
const socket = new Proxy({}, {
  get(target, method) {
    return () => null;
  },
});

module.exports = class ActorWrapper extends Actor {
  constructor(data = {}) {
    super();
    this.assign(data);
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
      gesture: new Stream('gesture'),
      trait: new Stream('trait').chained(false), // Passive traits
      tactic: new Stream('tactic'), // Immediate combat tactics
      action: new Stream('action'), // Active actions
      preAction: new Stream('preAction'), // Used to await/delay the current action
    };
  }

  get(key) {
    return this.mGet(key).then(data => data[key]);
  }

  mGet(...keys) {
    keys = keys.flat();

    return REDIS.mGet(keys.map(key => `${this}.${key}`)).then((values) => {
      return values.reduce((prev, value, i) => {
        const key = keys[i];
        value ??= this[key];
        return Object.assign(prev, { [key]: APP.castValue(value) });
      }, {});
    });
  }

  save(data = {}, NX = false) {
    this.assign(data, NX);

    return Promise.all(Object.entries(data).map(async ([key, value]) => {
      if (CONFIG.get(`app.spawn.${this.type}`).includes(key)) {
        await REDIS.set(`${this}.${key}`, this[key], { NX });
      }
    })).then(() => this);
  }

  assign(data, NX = false) {
    Object.entries(data).forEach(([key, value]) => {
      if (NX) this[key] ??= APP.castValue(value);
      else this[key] = APP.castValue(value);
    });
    return this;
  }

  send(event, message, ...rest) {
    if (rest.length) message = message.concat(' ', rest.flat().join(' '));
    return this.socket.emit(event, message);
  }

  query(...messages) {
    return this.socket.query('query', APP.styleText('dialog', '>', messages.flat().join(' ')));
  }

  async realm(...args) {
    return Promise.all(Object.values(Actor).map(async (actor) => {
      if (actor !== this) await actor.send(...args);
    }));
  }

  async broadcast(...args) {
    const room = CONFIG.get(await this.get('room'));
    room.units.forEach(unit => unit !== this && unit.send(...args));
  }

  async perimeter(...args) {
    const room = CONFIG.get(await this.get('room'));
    Object.values(room.exits).forEach((exit) => {
      exit.units.forEach(unit => unit !== this && unit.send(...args));
    });
  }

  stream(stream, ...args) {
    if (!(stream instanceof Stream)) stream = this.streams[stream];
    return super.stream(stream, ...args);
  }

  disconnect(...args) {
    this.removeAllPossibleListeners();
    this.socket.disconnect(...args);
    return this;
  }

  abortAllStreams() {
    Object.values(this.streams).forEach(stream => stream.abort());
    return this;
  }

  removeAllPossibleListeners() {
    this.removeAllListeners();
    Object.values(this.streams).forEach(stream => stream.abort() && stream.removeAllListeners());
    return this;
  }
};
