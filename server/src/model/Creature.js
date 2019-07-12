import CreatureStream from '../core/CreatureStream';
import Being from './Being';

export default class User extends Being {
  constructor(...args) {
    super(...args);
    this.isCreature = true;
    this.memory = [];
    this.stream$ = new CreatureStream(this);
  }

  process(data) {
    this.stream$.next(data);
  }
}
