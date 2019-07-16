import Model from '../core/Model';

export default class Unit extends Model {
  async Room() {
    return this.getData(this.room);
  }

  async Items() {
    return Promise.all(this.items.map(item => this.getData(item)));
  }
}
