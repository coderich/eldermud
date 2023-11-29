const { pipeline } = require('@coderich/util');
const { AbortError } = require('./Error');

module.exports = class Action {
  constructor(id, ...steps) {
    steps = steps.flat();

    return (startValue, context = {}) => {
      const listeners = [];

      let resolve, reject, started = false, aborted = false;
      const promise = new Promise((res, rej) => { resolve = res; reject = rej; });

      context.abort = (data) => {
        aborted = true;
        reject(new AbortError('Action Aborted', data));
      };

      pipeline(steps.map((step, index) => value => new Promise((res, rej) => {
        setImmediate(async () => {
          if (!aborted) {
            if (!started) await Promise.all(listeners.map(l => l(0)));
            started = true;
            Promise.race([promise, step(value, context)]).then(async (d) => {
              await Promise.all(listeners.map(l => l(index + 1)));
              res(d);
            }).catch(rej);
          }
        });
      })), startValue).then(resolve).catch(reject);

      return Object.defineProperties(promise.catch((e) => {
        if (!(e instanceof AbortError)) throw e;
        return e;
      }), {
        id: { value: id },
        steps: { value: steps.length },
        abort: { get() { return reason => context.abort(reason) && this; } },
        listen: { get() { return listener => listeners.push(listener) && this; } },
        aborted: { get: () => aborted },
        started: { get: () => started },
      });
    };
  }

  static define(id, ...steps) {
    return (Action[id] = new Action(id, steps));
  }
};
