import Model from '../core/Model';

export default class Item extends Model {
  async use(unit, obj) {
    switch (this.type) {
      case 'key': {
        const doors = await this.Doors();
        const door = doors.find(d => d.id === obj.id) || unit.abortAction('The key will not turn.');
        return door.unlock(unit);
      }
      default: return unit.abortAction('You can\'t use that!');
    }
  }

  async Obstacles() {
    return Promise.all(this.obstacles.map(obstacle => this.getData(obstacle)));
  }

  async Doors() {
    const obstacles = await this.Obstacles();
    return obstacles.filter(o => o.type === 'door');
  }
}
