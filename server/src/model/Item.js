import Model from '../core/Model';
import { roll as makeRoll } from '../service/game.service';

export default class Item extends Model {
  async use(unit) {
    switch (this.type) {
      case 'potion': {
        return this.effects.map(async (obj) => {
          const { effect, roll } = obj;
          const val = makeRoll(roll);

          switch (effect) {
            case 'increase-health': {
              const health = Math.min(unit.mhp, unit.hp + val);
              await (unit.setData(unit.id, 'hp', health));
              return Promise.all([
                unit.pullData(unit.id, 'items', this.id),
                unit.emit('message', { type: 'water', value: `You quaff ${this.name}, gaining ${val} health.` }),
                unit.status(),
              ]);
            }
            case 'increase-mana': {
              const mana = Math.min(unit.mma, unit.ma + val);
              await (unit.setData(unit.id, 'ma', mana));
              return Promise.all([
                unit.pullData(unit.id, 'items', this.id),
                unit.emit('message', { type: 'water', value: `You quaff ${this.name}, gaining ${val} mana.` }),
                unit.status(),
              ]);
            }
            default: {
              return Promise.resolve();
            }
          }
        });
      }
      default: {
        return unit.abortAction('You can\'t use that!');
      }
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
