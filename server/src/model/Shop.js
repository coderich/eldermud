import Model from '../core/Model';

export default class Shop extends Model {
  async Items() {
    return Promise.all(this.items.map(item => this.getData(item)));
  }
}
