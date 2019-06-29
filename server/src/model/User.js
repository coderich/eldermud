import Model from '../core/Model';
import Describer from '../core/Describer';

export default class User extends Model {
  constructor(...args) {
    super(...args);
    this.describer = new Describer(this);
  }

  async Room() {
    return this.get('room', this.room);
  }

  async describe(...args) {
    return this.describer.describe(...args);
  }
}
