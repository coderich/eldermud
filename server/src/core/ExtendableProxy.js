export default class ExtendableProxy {
  constructor(props) {
    return new Proxy(props, {
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
