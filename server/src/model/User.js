import Model from '../core/Model';
import Describer from '../core/Describer';
import AbortActionError from '../core/AbortActionError';

export default class User extends Model {
  constructor(...args) {
    super(...args);
    this.memory = {};
    this.items = this.items || [];
    this.describer = new Describer(this);
  }

  async Room() {
    return this.get('room', this.room);
  }

  async Items() {
    return Promise.all(this.items.map(item => this.get('item', item)));
  }

  async describe(type, obj) {
    const value = await this.describer.describe(type, obj);
    this.socket.emit('message', { type, value });
  }

  async grab(target) {
    const room = await this.Room();
    const item = await room.findItem(target, true);
    this.items.push(item.id);
    return item;
  }

  async drop(target) {
    const room = await this.Room();
    const item = await this.findItem(target, true);
    room.items.push(item.id);
    return item;
  }

  async findItem(target, take = false) {
    let index;
    const items = await this.Items();

    // Try plain search
    index = items.findIndex(it => it.name.indexOf(target.toLowerCase()) === 0);

    // Try Tokenize
    if (index < 0) {
      index = items.findIndex((it) => {
        const tokens = it.name.toLowerCase().split(' ');
        return tokens.find(tok => tok.indexOf(target.toLowerCase()) === 0);
      });
    }

    if (index < 0) throw new AbortActionError("You don't have that on you!");

    if (take) {
      this.items.splice(index, 1);
    }

    return items[index];
  }
}
