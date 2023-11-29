module.exports = class Stream {
  #thunks;
  #action;
  #flowing = false;

  constructor(name, ...thunks) {
    this.#thunks = thunks.flat();
    this.#flow();
  }

  abort() {
    this.#action?.abort();
    return this.clear();
  }

  clear() {
    this.#thunks.length = 0;
    return this;
  }

  push(...thunks) {
    this.#thunks.push(...thunks);
    this.#flow();
    return this;
  }

  async #flow() {
    if (!this.#flowing && this.#thunks.length) {
      this.#flowing = true;
      this.#action = this.#thunks.shift()(); // The thunk becomes an action!
      await this.#action;
      this.#flowing = false;
      this.#flow();
    }
  }

  static define(name, ...thunks) {
    return (Stream[name] = new Stream(name, thunks));
  }
};
