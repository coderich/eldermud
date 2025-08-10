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
    this.preActionStream = new Stream('preAction'); // Pre-action stream

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
      spatial: new Stream('spatial'), // Things that must happen in sequence (eg. hits)
      countdown: new Stream('countdown').chained(false), // IDK..
      effect: new Stream('effect').chained(false), // Active effects
      trait: new Stream('trait').chained(false), // Passive traits
      tactic: new Stream('tactic'), // Immediate combat tactics
      action: new Stream('action'), // Active actions
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
    this.assign(data);

    return Promise.all(Object.entries(data).map(async ([key, value]) => {
      if (CONFIG.get(`app.spawn.${this.type}`).includes(key)) {
        const $key = `${this}.${key}`;
        const $value = this[key];

        if (Array.isArray($value)) {
          await REDIS.del($key);
          if ($value.length) await Promise.all($value.map(v => REDIS.rPush($key, APP.castValue(v))));
        } else if ($value instanceof Set) {
          await REDIS.del($key);
          if ($value.size) await Promise.all($value.values().map(v => REDIS.sAdd($key, APP.castValue(v))));
        } else if (typeof $value === 'object') {
          await REDIS.hSet($key, $value);
        } else {
          await REDIS.set($key, `${$value}`, { NX });
        }
      }
    })).then(() => this);
  }

  assign(data, NX = false) {
    Object.entries(data).forEach(([key, value]) => {
      this[key] = APP.castValue(value);
      // if (NX) this[key] ??= APP.castValue(value);
      // else this[key] = APP.castValue(value);
    });
    return this;
  }

  send(event, message, ...rest) {
    if (rest.length) message = message.concat(' ', rest.flat().join(' '));
    return this.socket.emit(event, message);
  }

  query(...messages) {
    return this.socket.query('query', APP.styleText('muted', '>>>').concat(' ', APP.styleText('dialog', messages.flat().join(' ')), APP.styleText('dialog', ':')));
  }

  async realm(...args) {
    return Promise.all(Object.values(Actor).map(async (actor) => {
      if (actor !== this) await actor.send(...args);
    }));
  }

  async interpolate(msg, data) {
    const room = CONFIG.get(await this.get('room'));

    return Promise.all([
      this.send('text', APP.interpolate(msg, { ...data, actor: { name: 'You' } })),
      this !== data.target && data.target.send('text', APP.interpolate(msg, { ...data, target: { name: 'you' } }, true)),
      Array.from(room.units.values()).filter(el => ![this, data.target].includes(el)).forEach(el => el.send('text', APP.interpolate(msg, data, true))),
    ]);
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

  async exit(reason) {
    this.removeAllPossibleListeners(reason);
    if (!reason) await this.realm('text', APP.styleText('gesture', `${this.name} just hung up!`));
    else this.realm('text', `${this.name} has left the realm.`);
    const exit = CONFIG.get(await this.get('room'));
    exit?.units.delete(this);
    return this;
  }

  disconnect(reason) {
    this.removeAllPossibleListeners(reason);
    this.socket.disconnect(reason);
    return this.exit(reason);
  }

  abortAllStreams(reason) {
    Object.values(this.streams).forEach(stream => stream.abort(reason));
    return this;
  }

  removeAllPossibleListeners(reason) {
    this.removeAllListeners();
    Object.values(this.streams).forEach(stream => stream.abort(reason) && stream.removeAllListeners());
    return this;
  }
};
