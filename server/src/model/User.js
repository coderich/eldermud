import Model from '../core/Model';
import Describer from '../core/Describer';
import AbortActionError from '../core/AbortActionError';

export default class User extends Model {
  constructor(...args) {
    super(...args);
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

  async findItem(target, take = false) {
    const items = await this.Items();
    const index = items.findIndex(it => it.name.indexOf(target.toLowerCase()) === 0);
    if (index < 0) throw new AbortActionError("You don't have that on you!");

    if (take) {
      const { actions: { updateUser } } = this.store.info();
      const [item] = items.splice(index, 1);
      updateUser.dispatch({ id: this.id, items: items.map(it => it.id) });
      return item;
    }

    return items[index];
  }
}
