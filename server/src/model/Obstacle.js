import AbortActionError from '../core/AbortActionError';
import Model from '../core/Model';

export default class Obstacle extends Model {
  async Open() {
    if (this.state.open) throw new AbortActionError('Door already open!');
    const { actions: { updateObstacle } } = this.store.info();
    updateObstacle.dispatch({ id: this.id, state: { open: true } });
  }

  async Close() {
    if (!this.state.open) throw new AbortActionError('Door already closed!');
    const { actions: { updateObstacle } } = this.store.info();
    updateObstacle.dispatch({ id: this.id, state: { open: false } });
  }
}