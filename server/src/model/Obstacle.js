import Model from '../core/Model';

export default class Obstacle extends Model {
  canSeeThru() {
    switch (this.type) {
      case 'door': return this.state.open;
      default: return true;
    }
  }

  async lock(unit) {
    const locked = await this.getData(this.id, 'state.locked');
    if (locked) unit.abortAction(`The ${this.name} is already locked!`);
    await this.setData(this.id, 'state.locked', true);
    return unit.describe('info', `The ${this.name} is now locked.`);
  }

  async unlock(unit) {
    const locked = await this.getData(this.id, 'state.locked');
    if (!locked) unit.abortAction(`The ${this.name} is already unlocked!`);
    await this.setData(this.id, 'state.locked', false);
    return unit.describe('info', `The ${this.name} is now unlocked.`);
  }

  async open(unit) {
    const state = await this.getData(this.id, 'state');
    if (state.locked) unit.abortAction(`The ${this.name} is locked!`);
    if (state.open) unit.abortAction(`The ${this.name} is already open!`);
    await this.setData(this.id, 'state.open', true);
    return unit.describe('info', `The ${this.name} is now open.`);
  }

  async close(unit) {
    const state = await this.getData(this.id, 'state');
    if (!state.open) unit.abortAction(`The ${this.name} is already closed!`);
    await this.setData(this.id, 'state.open', false);
    return unit.describe('info', `The ${this.name} is now closed.`);
  }

  resolve() {
    switch (this.type) {
      case 'door': return this.state.open;
      default: return false;
    }
  }
}
