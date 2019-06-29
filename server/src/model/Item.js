import Model from '../core/Model';
import AbortActionError from '../core/AbortActionError';

export default class Item extends Model {
  async Obstacles() {
    return Promise.all(this.obstacles.map(obstacle => this.get('obstacle', obstacle)));
  }

  async use(obj) {
    switch (this.type) {
      case 'key': {
        const obstacles = await this.Obstacles();
        const doors = obstacles.filter(o => o.type === 'door');
        const door = doors.find(d => d.id === obj.id);
        if (!door) return 'The key will not turn.';
        return door.Unlock();
      }
      default: throw new AbortActionError("You can't use that!");
    }
  }
}
