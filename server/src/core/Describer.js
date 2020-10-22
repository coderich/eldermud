import Chance from 'chance';
import { clone, isObjectLike } from 'lodash';
import { directions } from '../service/util.service';

const chance = new Chance();

export default class Describer {
  constructor(id, getData) {
    this.id = id;
    this.getData = getData;
  }

  async describe(type, o, opts = {}) {
    const target = clone(o);

    switch (type.toLowerCase()) {
      case 'room': {
        target.exits = await this.describe('exits', target.exits);
        target.items = await this.describe('items', await target.Items());
        target.units = (await target.Units())
          .filter(unit => unit.id !== this.id)
          .sort((a, b) => {
            if (a.isUser && b.isUser) return 0;
            if (a.isCreature && b.isCreature) return 0;
            if (a.isUser) return 1;
            if (b.isUser) return 1;
            return -1;
          })
          .map(unit => ({
            id: unit.id,
            name: unit.name,
          }));
        if (!opts.full) delete target.description;
        break;
      }
      case 'exits': {
        const dirs = Object.keys(directions);

        return Promise.all(Object.entries(target).sort(([a], [b]) => {
          const indexA = dirs.indexOf(a);
          const indexB = dirs.indexOf(b);
          return indexA - indexB;
        }).map(([dir, obj]) => this.describe('exit', { [dir]: obj })));
      }
      case 'exit': {
        // Basic exit
        const [[dir, obj]] = Object.entries(target);
        const direction = directions[dir];
        if (!isObjectLike(obj)) return direction;

        // Obstacle(s)
        const [ids] = Object.values(obj);
        const obstacles = await Promise.all(ids.map(id => this.getData(id)));
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
      case 'unit': {
        const wounds = ['unwounded', 'slightly wounded', 'moderately wounded', 'heavily wounded', 'severely wounded', 'critically wounded', 'very critically wounded'];
        const healthPct = Math.round((target.hp / target.mhp) * 100);
        const woundIndex = Math.floor((100 - healthPct) / 15);
        const notices = [
          `${target.isUser ? 'He' : 'It'} appears to be ${wounds[woundIndex]}.`,
        ];

        return {
          name: target.name,
          description: chance.paragraph(),
          notices,
          party: {
            size: [2, 3],
            matrix: [
              [{ name: 'titan', size: [1, 3] }, { name: 'rat' }],
              [null],
              [null],
            ],
          },
        };
      }
      default: {
        break;
      }
    }

    return target;
  }
}
