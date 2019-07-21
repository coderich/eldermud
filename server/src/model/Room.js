import { isObjectLike, flatten } from 'lodash';
import Model from '../core/Model';
import { toRoom } from '../service/socket.service';
import { numToArray } from '../service/game.service';

const rooms = new Set();

export default class Room extends Model {
  async initialize() {
    if (rooms.has(this.id)) return this;

    rooms.add(this.id);

    if (!this.respawn) return this;

    const now = new Date().getTime();
    const creatures = await this.Creatures();
    const templateIds = creatures.map(c => c.template);

    if (!templateIds.length && this.spawn && this.spawn <= now) {
      const { num, blueprints } = this.spawnlings;
      const templates = await Promise.all(blueprints.map(id => this.getData(id)));
      const numToSpawn = this.roll(num);

      await Promise.all(numToArray(numToSpawn).map(() => {
        // First try for bosses
        const [boss] = templates.filter((t) => {
          const inRoom = templateIds.indexOf(t.id) > -1;
          if (inRoom) return false;
          if (!t.spawn) return false;
          if (t.spawn > now) return false;
          return true;
        }).sort((a, b) => a.spawn - b.spawn);

        if (boss) {
          templateIds.push(boss.id);
          return this.createSpawn(boss);
        }

        // Next try for ordinary creatures
        const regulars = templates.filter(t => !t.spawn);
        const regular = regulars[Math.floor(Math.random() * regulars.length)];

        if (regular) {
          templateIds.push(regular.id);
          return this.createSpawn(regular);
        }

        return Promise.resolve();
      }));

      await this.setData(this.id, 'spawn', false);
    }

    // Release room
    rooms.delete(this.id);

    return this;
  }

  async createSpawn(templateData) {
    const now = new Date().getTime();
    const id = `creature.${this.id}.${this.units.length}.${now}`;
    this.units.push(id);
    const hp = this.roll(templateData.hp);
    const exp = templateData.exp * hp;
    const template = templateData.id;
    const creature = await this.setData(id, Object.assign({}, templateData, { id, hp, exp, template, room: this.id, spawnRoom: this.id }));
    await this.pushData(this.id, 'units', creature.id);
    return toRoom(this, 'message', { type: 'info', value: `A ${creature.name} appears out of nowhere!` });
  }

  async search() {
    const items = await Promise.all(this.items.map(item => this.getData(item)));
    const hiddenItems = items.filter(item => item.state.hidden);
    await Promise.all(hiddenItems.map(item => this.setData(item.id, 'state.hidden', false)));
    return hiddenItems;
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
    return (await Promise.all(this.units.map(unit => this.getData(unit)))).filter(u => u);
  }

  async Players() {
    return (await this.Units()).filter(unit => unit.isUser);
  }

  async Creatures() {
    return (await this.Units()).filter(unit => unit.isCreature);
  }
}
