import { isObjectLike, flatten } from 'lodash';
import { Get, get as dataGet } from '../service/DataService';
import Model from '../core/Model';
import { makeCreature, chance } from '../service/game.service';

export default class Room extends Model {
  constructor(...args) {
    super(...args);
    this.description = chance.paragraph();
    this.items = this.items || [];
    this.beings = this.beings || [];
    // if (this.spawn) this.spawnCheck();
  }

  async spawnCheck() {
    const now = new Date().getTime();
    const creatures = await this.Creatures();

    if (creatures.length < this.spawnlings.max && this.spawn <= now) {
      const ids = Object.keys(this.spawnlings.creatures);
      const templates = await Promise.all(ids.map(id => Get(id)));

      // First try for bosses
      const [boss] = templates.filter((t) => {
        const inRoom = creatures.filter(c => c.template === t.id);
        if (!t.spawn) return false;
        if (t.spawn > now) return false;
        if (inRoom.length >= this.spawnlings.creatures[t.id].max) return false;
        return true;
      }).sort((a, b) => a.spawn - b.spawn);

      if (boss) {
        const spawn = await makeCreature(boss, { room: this.id });
        boss.spawn = now + boss.respawn;
        this.join(spawn.id);
        this.spawnCheck();
        return;
      }

      // Next try for ordinary creatures
      const regulars = templates.filter((t) => {
        const inRoom = creatures.filter(c => c.template === t.id);
        if (t.spawn) return false;
        if (inRoom.length >= this.spawnlings.creatures[t.id].max) return false;
        return true;
      });

      const regular = regulars[Math.floor(Math.random() * regulars.length)];

      if (regular) {
        const spawn = await makeCreature(regular, { room: this.id });
        this.join(spawn.id);
        this.spawnCheck();
        return;
      }
    }

    // Nothing to do
    this.spawn = new Date().getTime() + this.respawn;
    setTimeout(() => this.spawnCheck(), this.respawn + 10);
  }

  async findItem(target) {
    return (await this.resolveTarget('items', target)) || this.balk("You don't see that here.");
  }

  join(id) {
    this.beings.push(id);
  }

  leave(id) {
    this.beings.splice(this.beings.indexOf(id), 1);
  }

  takeItem(item) {
    const index = this.items.indexOf(item.id);
    if (index < 0) this.balk("You don't see that here.");
    this.items.splice(index, 1);
    return item;
  }

  async search() {
    const items = await Promise.all(this.items.map(item => dataGet(item)));
    return items.filter(item => item.state.hidden).map((item) => {
      item.state.hidden = false;
      return item;
    });
  }

  async Items() {
    const items = await Promise.all(this.items.map(item => dataGet(item)));
    return items.filter(item => !item.state.hidden);
  }

  async Exit(dir) {
    const exit = this.exits[dir];
    if (!exit) return undefined;

    const roomId = exit instanceof Object ? Object.keys(exit)[0] : exit;
    return dataGet(roomId);
  }

  async Exits() {
    return Promise.all(Object.values(this.exits).map((exit) => {
      const [roomId = exit] = Object.keys(exit);
      return dataGet(roomId);
    }));
  }

  async Obstacle(dir) {
    const exit = this.exits[dir];
    if (!exit) return undefined;
    if (!isObjectLike(exit)) return undefined;

    const [obstacles] = Object.values(exit);
    return Promise.all(obstacles.map(obstacle => dataGet(obstacle)));
  }

  async Obstacles() {
    const obstacles = flatten(Object.values(this.exits).filter(exit => isObjectLike(exit)).map(obstacle => Object.values(obstacle)[0]));
    return Promise.all(obstacles.map(obstacle => dataGet(obstacle)));
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

  async Beings() {
    return Promise.all(this.beings.map(being => dataGet(being)));
  }

  async Players() {
    return (await this.Beings()).filter(being => being.isUser);
  }

  async Creatures() {
    return (await this.Beings()).filter(being => being.isCreature);
  }
}
