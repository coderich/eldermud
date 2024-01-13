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

    // Bind system events to this actor
    this.on('*', (event, context) => {
      const [type] = event.split(':');

      if (type === 'pre') {
        // This postpones the action (on the very very first step 0) until SYSTEM events are fired and finished
        context.promise.listen(step => step > 1 || Promise.all([SYSTEM.emit(event, context), SYSTEM.emit('*', event, context)]));
      } else {
        SYSTEM.emit(event, context);
        SYSTEM.emit('*', event, context);
      }
    });
  }

  mGet(...keys) {
    keys = keys.flat();
    return REDIS.mGet(keys.map(key => `${this}.${key}`)).then((values) => {
      return values.reduce((prev, value, i) => {
        if (APP.isNumeric(value)) value = parseInt(value, 10);
        else if (APP.isBoolean(value)) value = Boolean(`${value.toLowerCase()}` === 'true');
        return Object.assign(prev, { [keys[i]]: value });
      }, {});
    });
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
