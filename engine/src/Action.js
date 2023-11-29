const { pipeline } = require('@coderich/util');

class AbortError extends Error {}

module.exports = class Action {
  constructor(...fns) {
    return (value) => {
      let abort;
      const abortPromise = new Promise((resolve, reject) => { abort = () => reject(new AbortError('Action Aborted')); });
      return Object.defineProperty(pipeline(fns.flat().map(fn => () => {
        return Promise.race([abortPromise, fn(value, { abort })]).then(newValue => (value = newValue));
      }), value).catch((e) => {
        if (!(e instanceof AbortError)) throw e;
      }), 'abort', { value: abort });
    };
  }

  static define(name, ...fns) {
    return (Action[name] = new Action(fns));
  }
};
