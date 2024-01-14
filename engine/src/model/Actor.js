const { Actor, Stream } = require('@coderich/gameflow');

// Socket Stub
const socket = new Proxy({}, {
  get(target, method) {
    return () => null;
  },
});

module.exports = class ActorWrapper extends Actor {
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
      trait: new Stream('trait'), // Passive traits
      action: new Stream('action'), // Active actions
      preAction: new Stream('preAction'),
      telepath: new Stream('telepath'),
    };
  }

  mGet(...keys) {
    keys = keys.flat();
    return REDIS.mGet(keys.map(key => `${this}.${key}`)).then((values) => {
      return values.reduce((prev, value, i) => {
        return Object.assign(prev, { [keys[i]]: APP.castValue(value) });
      }, {});
    });
  }

  save(data = {}, NX = false) {
    return Promise.all(Object.entries(data).map(async ([key, value]) => {
      let currentValue = this[key];

      if (CONFIG.get(`app.spawn.${this.type}`).includes(key)) {
        currentValue = await REDIS.set(`${this}.${key}`, value.toString(), { NX, GET: true });
        this[key] = CONFIG.get(`${value}`) ?? value;
      } else {
        this[key] = value;
      }

      return { [key]: currentValue };
    })).then((values) => {
      return Object.assign(...values);
    });

    // // Assign
    // Object.assign(this, data);

    // return result;

    // return Promise.all(CONFIG.get(`app.spawn.${this.type}`).map((attr) => {
    //   const key = `${this}.${attr}`;
    //   const value = this[attr]?.toString();
    //   return value === undefined ? Promise.resolve() : REDIS.set(key, value, { NX, GET: true });
    // })).then((values) => {
    //   return values.reduce((prev, value, i) => {

    //   }, {});
    // });
  }

  send(event, message, ...rest) {
    if (rest.length) message = message.concat(' ', rest.flat().join(' '));
    return this.socket.emit(event, message);
  }

  query(...messages) {
    return this.socket.query('cmd', APP.styleText('query', '>', messages.flat().join(' ')));
  }

  async broadcast(...args) {
    const room = CONFIG.get(await REDIS.get(`${this}.room`));
    room.units?.forEach(unit => unit !== this && unit.send(...args));
  }

  disconnect(...args) {
    this.socket.disconnect(...args);
  }

  stream(stream, ...args) {
    if (!(stream instanceof Stream)) stream = this.streams[stream];
    return super.stream(stream, ...args);
  }
};
