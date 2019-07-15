import { Model } from '@coderich/hotrod';
import { getSocket } from '../service/SocketService';
import { emit } from '../service/event.service';
import { roll } from '../service/game.service';
import AbortActionError from '../error/AbortActionError';
import InterruptActionError from '../error/InterruptActionError';
import Describer from './Describer';

export default class extends Model {
  constructor(props) {
    super({ enumerable: true });
    this.timeout = ms => new Promise(res => setTimeout(res, ms));
    this.defineProperties({ ...props }, { writable: true, enumerable: true });
    this.describer = new Describer(this.id);
    this.emit = emit;
    this.roll = roll;
    this.socket = getSocket(this.id);
  }

  abortAction(value) {
    this.socket.emit('message', { type: 'error', value });
    throw new AbortActionError(value);
  }

  async describe(type, obj) {
    return { type, value: await this.describer.describe(type, obj) };
  }

  async resolveTarget(domain, target) {
    let index;
    const tcm = domain.charAt(0).toUpperCase() + domain.slice(1);
    const items = await this[tcm]();

    // Try plain search
    index = items.findIndex(it => it.name.indexOf(target.toLowerCase()) === 0);

    // Try Tokenize
    if (index < 0) {
      index = items.findIndex((it) => {
        const tokens = it.name.toLowerCase().split(' ');
        return tokens.find(tok => tok.indexOf(target.toLowerCase()) === 0);
      });
    }

    if (index < 0) return false;
    return items[index];
  }
}
