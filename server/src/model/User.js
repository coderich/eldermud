import Model from '../core/Model';

export default class User extends Model {
  async Room() {
    return this.get('room', this.room);
  }
}
