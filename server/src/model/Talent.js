import Model from '../core/Model';

export default class Talent extends Model {
  async execute(id, command) {
    const unit = await this.getData(id);
    if (this.cost > unit.exp) return;
    await this.incData(id, 'exp', -this.cost);

    unit.emit('message', { type: 'info', value: `You focus your energy towards ${this.name}` });

    this.effects.forEach((effect) => {
      switch (effect.type) {
        case 'heal': {
          const roll = this.roll(effect.roll);
          const hp = Math.min(unit.mhp, unit.hp + roll);
          this.setData(id, 'hp', hp);
          unit.emit('message', { type: 'info', value: `You gain ${roll} health!` });
          break;
        }
        default: break;
      }
    });

    unit.status();
  }
}
