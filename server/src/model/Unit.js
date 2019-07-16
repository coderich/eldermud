import Model from '../core/Model';
import { roll } from '../service/game.service';

export default class Unit extends Model {
  constructor(...args) {
    super(...args);
    this.isUnit = true;
    this.roll = roll;
    this.timeout = ms => new Promise(res => setTimeout(res, ms));
  }

  async Room() {
    return this.getData(this.room);
  }

  async Items() {
    return Promise.all(this.items.map(item => this.getData(item)));
  }
}
