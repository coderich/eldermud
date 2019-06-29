import { clone, isObjectLike } from 'lodash';

const directions = {
  n: 'north',
  s: 'south',
  e: 'east',
  w: 'west',
  ne: 'northeast',
  nw: 'northwest',
  se: 'southeast',
  sw: 'southwest',
};

export default class Describer {
  constructor(user) {
    this.user = user;
    this.get = user.get;
  }

  async describe(type, o) {
    const target = clone(o);

    switch (type.toLowerCase()) {
      case 'room': {
        target.exits = await this.describe('exits', target.exits);
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
        const obstacles = await Promise.all(ids.map(id => this.get('obstacle', id)));
        const [door] = obstacles.filter(obstacle => obstacle.type === 'door');
        if (!door) return direction;
        const description = await this.describe('door', door);
        return `${description} ${direction}`;
      }
      case 'door': {
        return `${target.state.open ? 'open' : 'closed'} door`;
      }
      default: {
        break;
      }
    }

    return target;
  }
}
