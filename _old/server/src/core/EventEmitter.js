import EventEmitter from 'events';
import { promiseChain } from '../service/util.service';

/**
 * EventEmitter.
 *
 * The difference is that I'm looking at each raw listeners to determine how many arguments it's expecting.
 * If it expects more than 1 we block and wait for it to finish before calling the next listener.
 */
export default class extends EventEmitter {
  async emit(event, data) {
    return promiseChain(this.rawListeners(event).map((wrapper) => {
      return () => new Promise((resolve, reject) => {
        const next = () => resolve();
        const numArgs = (wrapper.listener || wrapper).length;
        Promise.resolve(wrapper(data, next)).catch(e => reject(e));
        if (numArgs < 2) next();
      });
    }));
  }
}
