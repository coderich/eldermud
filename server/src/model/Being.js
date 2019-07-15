import { getData } from '../service/DataService';
import Model from '../core/Model';

export default class Being extends Model {
  constructor(...args) {
    super(...args);
    this.memory = [];
  }

  async Room() {
    return getData(this.room);
  }

  async Items() {
    return Promise.all(this.items.map(item => getData(item)));
  }
}
