import Chance from 'chance';
import { isObjectLike, flatten } from 'lodash';
import Model from '../core/Model';
import { addRoom } from '../service/room.service';

const chance = new Chance();

export default class Room extends Model {
  constructor(...args) {
    super(...args);
    this.description = chance.paragraph();
    addRoom(this.id);
  }

  async search() {
    const items = await Promise.all(this.items.map(item => this.getData(item)));
    const hiddenItems = items.filter(item => item.state.hidden);
    return Promise.all(hiddenItems.map(item => this.setData(item.id, 'state.hidden', false)));
  }

  async Items() {
    const items = await Promise.all(this.items.map(item => this.getData(item)));
    return items.filter(item => !item.state.hidden);
  }

  async Exit(dir) {
    const exit = this.exits[dir];
    if (!exit) return undefined;

    const roomId = exit instanceof Object ? Object.keys(exit)[0] : exit;
    return this.getData(roomId);
  }

  async Exits() {
    return Promise.all(Object.values(this.exits).map((exit) => {
      const [roomId = exit] = Object.keys(exit);
      return this.getData(roomId);
    }));
  }

  async Obstacle(dir) {
    const exit = this.exits[dir];
    if (!exit) return undefined;
    if (!isObjectLike(exit)) return undefined;

    const [obstacles] = Object.values(exit);
    return Promise.all(obstacles.map(obstacle => this.getData(obstacle)));
  }

  async Obstacles() {
    const obstacles = flatten(Object.values(this.exits).filter(exit => isObjectLike(exit)).map(obstacle => Object.values(obstacle)[0]));
    return Promise.all(obstacles.map(obstacle => this.getData(obstacle)));
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

  async Units() {
    return Promise.all(this.units.map(unit => this.getData(unit)));
  }

  async Players() {
    return (await this.Units()).filter(unit => unit.isUser);
  }

  async Creatures() {
    return (await this.Units()).filter(unit => unit.isCreature);
  }
}
