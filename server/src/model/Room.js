import { isObjectLike, flatten } from 'lodash';
import Model from '../core/Model';

export default class Room extends Model {
  async Exit(dir) {
    const exit = this.exits[dir];
    if (!exit) return undefined;

    const [roomId = exit] = Object.keys(exit);
    return this.get('room', roomId);
  }

  async Exits() {
    return Promise.all(Object.values(this.exits).map((exit) => {
      const [roomId = exit] = Object.keys(exit);
      return this.get('room', roomId);
    }));
  }

  async Obstacle(dir) {
    const exit = this.exits[dir];
    if (!exit) return undefined;
    if (!isObjectLike(exit)) return undefined;

    const [obstacles] = Object.values(exit);
    return Promise.all(obstacles.map(obstacle => this.get('obstacle', obstacle)));
  }

  async Obstacles() {
    const obstacles = flatten(Object.values(this.exits).filter(exit => isObjectLike(exit)).map(obstacle => Object.values(obstacle)[0]));
    return Promise.all(obstacles.map(obstacle => this.get('obstacle', obstacle)));
  }

  async Door(dir) {
    const obstacles = await this.Obstacle(dir);
    if (!obstacles) return undefined;
    return obstacles.filter(obstacle => obstacle.type === 'door')[0];
  }

  async Doors() {
    const obstacles = await this.Obstacles();
    return obstacles.filter(obstacle => obstacle.type === 'door');
  }
}
