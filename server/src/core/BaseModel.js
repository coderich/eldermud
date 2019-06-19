export default class BaseModel {
  constructor(name, props, { get }) {
    return new Proxy(props, {
      get: (target, prop, receiver) => {
        // Special get method
        if (prop === 'hydrate') {
          return (m) => {
            // const m = this.aliasProp ? this.aliasProp(model) : model;
            if (Array.isArray(target[m])) return Promise.all(target[m].map(id => get(m.slice(0, 1), id)));
            return get(m, target[m]);
          };
        }

        // Default property values
        return target[prop];
      },
      set: (target, prop, value) => {
        target[prop] = value;
        return true;
      },
    });
  }
}
