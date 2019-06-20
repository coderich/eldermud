export default class BaseModel {
  constructor(name, props, helpers) {
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
