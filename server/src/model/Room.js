import { isObjectLike, flatten } from 'lodash';
import Model from '../core/Model';

export default class Room extends Model {
  constructor(...args) {
    super(...args);
    this.items = this.items || [];
    this.occupants = this.occupants || [];
  }

  async findItem(target) {
    let index;
    const items = await this.Items();

    // Try plain search
    index = items.findIndex(it => it.name.indexOf(target.toLowerCase()) === 0);

    // Try Tokenize
    if (index < 0) {
      index = items.findIndex((it) => {
        const tokens = it.name.toLowerCase().split(' ');
        return tokens.find(tok => tok.indexOf(target.toLowerCase()) === 0);
      });
    }

    if (index < 0) this.balk("You don't see that here.");

    return items[index];
  }

  join(being) {
    this.occupants.push(being);
  }

  leave(being) {
    this.occupants.splice(this.occupants.indexOf(being), 1);
  }

  takeItem(item) {
    const index = this.items.indexOf(item.id);
    if (index < 0) this.balk("You don't see that here.");
    this.items.splice(index, 1);
    return item;
  }

  async search() {
    const items = await Promise.all(this.items.map(item => this.dao.get('item', item)));
    return items.filter(item => item.state.hidden).map((item) => {
      item.state.hidden = false;
      return item;
    });
  }

  async Items() {
    const items = await Promise.all(this.items.map(item => this.dao.get('item', item)));
    return items.filter(item => !item.state.hidden);
  }

  async Exit(dir) {
    const exit = this.exits[dir];
    if (!exit) return undefined;

    const [roomId = exit] = Object.keys(exit);
    return this.dao.get('room', roomId);
  }

  async Exits() {
    return Promise.all(Object.values(this.exits).map((exit) => {
      const [roomId = exit] = Object.keys(exit);
      return this.dao.get('room', roomId);
    }));
  }

  async Obstacle(dir) {
    const exit = this.exits[dir];
    if (!exit) return undefined;
    if (!isObjectLike(exit)) return undefined;

    const [obstacles] = Object.values(exit);
    return Promise.all(obstacles.map(obstacle => this.dao.get('obstacle', obstacle)));
  }

  async Obstacles() {
    const obstacles = flatten(Object.values(this.exits).filter(exit => isObjectLike(exit)).map(obstacle => Object.values(obstacle)[0]));
    return Promise.all(obstacles.map(obstacle => this.dao.get('obstacle', obstacle)));
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
