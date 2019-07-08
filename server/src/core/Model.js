import { Model } from '@coderich/hotrod';
import Describer from './Describer';
import AbortActionError from './AbortActionError';

export default class extends Model {
  constructor(props) {
    super({ enumerable: true });
    this.describer = new Describer(props.get);
    this.balk = (msg) => { throw new AbortActionError(msg); };
    this.timeout = ms => new Promise(res => setTimeout(res, ms));
    this.defineProperties({ ...props }, { writable: true, enumerable: true });
  }

  async describe(type, obj) {
    return { type, value: await this.describer.describe(type, obj) };
  }

  async Room() {
    return this.get('room', this.room);
  }

  async Items() {
    return Promise.all(this.items.map(item => this.get('item', item)));
  }
}
