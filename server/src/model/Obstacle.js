import Model from '../core/Model';

export default class Obstacle extends Model {
  async unlock() {
    if (!this.state.locked) this.balk(`The ${this.name} is already unlocked!`);
    this.state.locked = false;
    return this.describe('info', `The ${this.name} is now unlocked.`);
  }

  async open() {
    if (this.state.locked) this.balk(`The ${this.name} is locked!`);
    if (this.state.open) this.balk(`The ${this.name} is already open!`);
    this.state.open = true;
    return this.describe('info', `The ${this.name} is now open.`);
  }

  async close() {
    if (!this.state.open) this.balk(`The ${this.name} is already closed!`);
    this.state.open = false;
    return this.describe('info', `The ${this.name} is now closed.`);
  }

  resolve() {
    switch (this.type) {
      case 'door': return this.state.open;
      default: return false;
    }
  }
}
