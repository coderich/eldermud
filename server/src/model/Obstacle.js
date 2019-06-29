import AbortActionError from '../core/AbortActionError';
import Model from '../core/Model';

export default class Obstacle extends Model {
  async Unlock() {
    if (!this.state.locked) throw new AbortActionError(`The ${this.name} is already unlocked!`);
    const { actions: { updateObstacle } } = this.store.info();
    updateObstacle.dispatch({ id: this.id, state: { open: true, locked: false } });
    return `The ${this.name} is now unlocked.`;
  }

  async Open() {
    if (this.state.locked) throw new AbortActionError(`The ${this.name} is locked!`);
    if (this.state.open) throw new AbortActionError(`The ${this.name} is already open!`);
    const { actions: { updateObstacle } } = this.store.info();
    updateObstacle.dispatch({ id: this.id, state: { open: true } });
    return `The ${this.name} is now open.`;
  }

  async Close() {
    if (!this.state.open) throw new AbortActionError(`The ${this.name} is already closed!`);
    const { actions: { updateObstacle } } = this.store.info();
    updateObstacle.dispatch({ id: this.id, state: { open: false } });
    return `The ${this.name} is now closed.`;
  }
}
