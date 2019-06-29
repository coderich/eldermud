import Model from '../core/Model';
import Describer from '../core/Describer';

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
}
