const { pipeline } = require('@coderich/util');
const { AbortError } = require('./Error');

module.exports = class Action {
  constructor(name, ...steps) {
    return (startValue) => {
      const context = {};
      const listeners = [];

      let resolve, reject, started = false, aborted = false;
      const promise = new Promise((res, rej) => { resolve = res; reject = rej; });

      context.abort = (data) => {
        aborted = true;
        reject(new AbortError('Action Aborted', data));
      };

      pipeline(steps.flat().map((step, index) => value => new Promise((res, rej) => {
        setImmediate(() => {
          if (!aborted) {
            if (!started) listeners.forEach(l => l(0));
            started = true;
            Promise.race([promise, step(value, context)]).then((d) => {
              listeners.forEach(l => l(index + 1));
              res(d);
            }).catch(rej);
          }
        });
      })), startValue).then(resolve).catch(reject);

      return Object.defineProperties(promise.catch((e) => {
        if (!(e instanceof AbortError)) throw e;
        return e;
      }), {
        name: { value: name },
        abort: { value: context.abort },
        aborted: { get: () => aborted },
        started: { get: () => started },
        listen: { value: listener => listeners.push(listener) },
      });
    };
  }

  static define(name, ...steps) {
    return (Action[name] = new Action(name, steps));
  }
};
