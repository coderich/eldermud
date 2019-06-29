import AbortActionError from '../core/AbortActionError';
import Model from '../core/Model';

export default class Obstacle extends Model {
  async Unlock() {
    if (!this.state.locked) throw new AbortActionError('Door already unlocked!');
    const { actions: { updateObstacle } } = this.store.info();
    updateObstacle.dispatch({ id: this.id, state: { open: true, locked: false } });
    return 'The door is now unlocked.';
  }

  async Open() {
    if (this.state.locked) throw new AbortActionError('Door is locked!');
    if (this.state.open) throw new AbortActionError('Door already open!');
    const { actions: { updateObstacle } } = this.store.info();
    updateObstacle.dispatch({ id: this.id, state: { open: true } });
    return 'The door is now open.';
  }

  async Close() {
    if (!this.state.open) throw new AbortActionError('Door already closed!');
    const { actions: { updateObstacle } } = this.store.info();
    updateObstacle.dispatch({ id: this.id, state: { open: false } });
    return 'The door is now closed.';
  }
}
