export default class Model {
  constructor(name, props, helpers) {
    // We want our methods to be enumerable
    Object.getOwnPropertyNames(Object.getPrototypeOf(this)).forEach((prop) => {
      if (prop !== 'constructor') {
        Object.defineProperty(this, prop, {
          value: this[prop],
          writable: false,
          enumerable: true,
        });
      }
    });

    return new Proxy(Object.assign(this, props, helpers), {
      get: (target, prop, receiver) => {
        return target[prop];
      },
      set: (target, prop, value) => {
        target[prop] = value;
        return true;
      },
    });
  }
}
