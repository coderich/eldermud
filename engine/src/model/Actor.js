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
    this.mandatoryStream = new Stream('mandatory'); // Mandatory wait stream

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
      trait: new Stream('trait').chained(false), // Passive traits
      effect: new Stream('effect').chained(false), // Active effects
      action: new Stream('action'), // Active actions
      tactic: new Stream('tactic'), // Combat tactics
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

  assign(data) {
    return Object.entries(data).reduce((prev, [key, value]) => {
      return Object.assign(prev, { [key]: APP.castValue(value) });
    }, this);
  }

  write(...args) {
    return this.socket.write(args.join(' '));
  }

  writeln(...args) {
    return this.socket.writeln(args.join(' '));
  }

  prompt(...messages) {
    return this.socket.prompt(APP.styleText('muted', '>>>').concat(' ', APP.styleText('dialog', messages.flat().join(' ')), APP.styleText('dialog', ':'))).then(text => ({ text }));
  }

  send(event, message, ...rest) {
    if (rest.length) message = message.concat(' ', rest.flat().join(' '));
    return this.socket.emit(event, message);
  }

  query(...messages) {
    return this.socket.query(APP.styleText('muted', '>>>').concat(' ', APP.styleText('dialog', messages.flat().join(' ')), APP.styleText('dialog', ':'))).then(text => ({ text }));
  }

  async realm(...args) {
    return Promise.all(Object.values(Actor).map(async (actor) => {
      if (actor !== this) await actor.writeln(...args);
    }));
  }

  async broadcast(...args) {
    const room = CONFIG.get(await this.get('room'));
    room.units.forEach(unit => unit !== this && unit.writeln(...args));
  }

  async perimeter(...args) {
    const room = CONFIG.get(await this.get('room'));
    Object.values(room.exits).forEach((exit) => {
      exit.units.forEach(unit => unit !== this && unit.writeln(...args));
    });
  }

  async interpolate(msg, data, opts = {}) {
    opts.style ??= 'none';
    opts.toRoom ??= true;

    const actor = { name: 'you' };
    const actorIndex = msg.indexOf('{actor.name}');
    const targetIndex = msg.indexOf('{target.name}');
    const actorFirst = actorIndex !== -1 && (targetIndex === -1 || actorIndex < targetIndex);
    const targetFirst = targetIndex !== -1 && (actorIndex === -1 || targetIndex < actorIndex);
    const shouldPluralizeActor = !actorFirst && targetFirst && this !== data.target;
    const shouldPluralizeTarget = !targetFirst && (!actorFirst || (data.actor !== data.target));
    const target = this === data.target ? { name: 'you' } : data.target;
    const roomMsg = APP.styleText(opts.style, APP.interpolate(msg, data, true));
    const actorMsg = APP.styleText(opts.style, APP.ucFirst(APP.interpolate(msg, { ...data, actor, target }, shouldPluralizeActor)));
    const targetMsg = APP.styleText(opts.style, APP.ucFirst(APP.interpolate(msg, { ...data, target: { name: 'you' } }, shouldPluralizeTarget)));

    return Promise.all([
      this.writeln(actorMsg),
      this !== data.target && data.target.writeln?.(targetMsg), // The "target" isn't always another unit/player
      opts.toRoom && Array.from(CONFIG.get(await this.get('room')).units.values()).filter(el => ![this, data.target].includes(el)).forEach(el => el.writeln(roomMsg)),
    ]);
  }

  stream(stream, ...args) {
    if (!(stream instanceof Stream)) stream = this.streams[stream];
    return super.stream(stream, ...args);
  }

  unshift(stream, ...args) {
    if (!(stream instanceof Stream)) stream = this.streams[stream];
    return super.unshift(stream, ...args);
  }

  async exit(reason) {
    this.removeAllPossibleListeners(reason);
    if (!reason) await this.realm(APP.styleText('gesture', `${this.name} just hung up!`));
    else this.realm(`${this.name} has left the realm.`);
    const room = CONFIG.get(await this.get('room'));
    room?.units.delete(this);
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
