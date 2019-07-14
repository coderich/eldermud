import { get as dataGet } from '../service/DataService';
import Model from '../core/Model';

export default class Item extends Model {
  async use(obj) {
    switch (this.type) {
      case 'key': {
        const obstacles = await this.Obstacles();
        const doors = obstacles.filter(o => o.type === 'door');
        const door = doors.find(d => d.id === obj.id) || this.balk('The key will not turn.');
        return door.unlock();
      }
      default: return this.balk("You can't use that!");
    }
  }

  async Obstacles() {
    return Promise.all(this.obstacles.map(obstacle => dataGet(obstacle)));
  }
}
