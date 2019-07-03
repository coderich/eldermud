// TODO: Is a class really necessary? What benefit does this approach have over just using a regular object
export default class Model {
  constructor(name, props, helpers) {
    props.state = props.state || {};

    // We want our class methods to be enumerable
    Object.getOwnPropertyNames(Object.getPrototypeOf(this)).forEach((prop) => {
      if (prop !== 'constructor') {
        Object.defineProperty(this, prop, {
          value: this[prop],
          writable: false, // Prevent accidental override
          enumerable: true,
        });
      }
    });

    // What you return from the constructor is what 'new' returns
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
