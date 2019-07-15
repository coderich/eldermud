import { clone, isObjectLike } from 'lodash';
import { getData } from '../service/DataService';

const directions = {
  n: 'north',
  s: 'south',
  e: 'east',
  w: 'west',
  ne: 'northeast',
  nw: 'northwest',
  se: 'southeast',
  sw: 'southwest',
  u: 'up',
  d: 'down',
};

export default class Describer {
  constructor(id) {
    this.id = id;
  }

  async describe(type, o) {
    const target = clone(o);

    switch (type.toLowerCase()) {
      case 'room': {
        target.exits = await this.describe('exits', target.exits);
        target.items = await this.describe('items', await target.Items());
        target.beings = (await target.Units()).filter(unit => unit.id !== this.id).map(unit => unit.name);
        delete target.description;
        break;
      }
      case 'exits': {
        return Promise.all(Object.entries(target).map(([dir, obj]) => this.describe('exit', { [dir]: obj })));
      }
      case 'exit': {
        // Basic exit
        const [[dir, obj]] = Object.entries(target);
        const direction = directions[dir];
        if (!isObjectLike(obj)) return direction;

        // Obstacle(s)
        const [ids] = Object.values(obj);
        const obstacles = await Promise.all(ids.map(id => getData(id)));
        const [door] = obstacles.filter(obstacle => obstacle.type === 'door');
        if (!door) return undefined;
        const description = await this.describe('door', door);
        return `${description} ${direction}`;
      }
      case 'door': {
        return `${target.state.open ? 'open' : 'closed'} ${target.name}`;
      }
      case 'items': {
        return Promise.all(target.map(item => this.describe('item', item)));
      }
      case 'item': {
        return target.name;
      }
      default: {
        break;
      }
    }

    return target;
  }
}
