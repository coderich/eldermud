const { pipeline } = require('@coderich/util');
const { AbortError } = require('./Error');

/**
 * An action is just a special function with defined properties to control the flow.
 * Each action constitues a sequence of steps; each discrete enough to satisfy abort() behavior.
 */
module.exports = class Action {
  constructor(id, ...steps) {
    steps = steps.flat();

    return (startValue, context = {}) => {
      // Instead of emitting events like crazy, we allow callback listeners
      const listeners = [];

      // The action is a promise that is resolved or rejected
      let resolve, reject, started = false, aborted = false;
      const promise = new Promise((res, rej) => { resolve = res; reject = rej; });

      // Method to abort the action
      context.abort = (data) => {
        aborted = true;
        reject(new AbortError('Action Aborted', data));
      };

      // Pipeline step by step
      pipeline(steps.map((step, index) => value => new Promise((res, rej) => {
        setImmediate(async () => {
          if (!aborted) {
            if (!started) await Promise.all(listeners.map(l => l(0)));
            started = true;
            Promise.race([promise, step(value, context)]).then((data) => {
              Promise.all(listeners.map(l => l(index + 1))).then(() => res(data));
            }).catch(rej);
          }
        });
      })), startValue).then(resolve).catch(reject);

      // We decorate (and return) the promise with additional props
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
