import { of } from 'rxjs';
import { tap, delay, mergeMap } from 'rxjs/operators';
import UserStream from '../core/UserStream';
import Being from './Being';

export default class User extends Being {
  constructor(...args) {
    super(...args);
    this.isUser = true;
    this.stream$ = new UserStream(this);
  }

  process(data) {
    this.stream$.next(data);
  }

  attack(target) {
    return of('attack').pipe(
      mergeMap(async () => {
        const room = await this.Room();
        const being = (await room.resolveTarget('beings', target)) || this.balk("You don't see that here.");
        return being;
      }),
      delay(1000),
      tap((being) => {
        const damage = this.roll('2d4');
        this.emit('attack', { source: this, target: being, damage });
      }),
      delay(1000),
    );
  }

  async findItem(target, take = false) {
    return (await this.resolveTarget('items', target, take)) || this.balk("You don't have that on you!");
  }
}
