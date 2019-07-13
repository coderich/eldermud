import { of } from 'rxjs';
import { tap, delay, mergeMap } from 'rxjs/operators';
import UserStream from '../core/UserStream';
import Being from './Being';

export default class User extends Being {
  constructor(...args) {
    super(...args);
    this.isUser = true;
    this.stream$ = new UserStream(this);
    this.combatEngaged = false;
  }

  process(data) {
    this.stream$.next(data);
  }

  attack(target) {
    const [attack] = Object.values(this.attacks);

    return of('attack').pipe(
      mergeMap(async () => {
        const room = await this.Room();
        const being = (await room.resolveTarget('beings', target)) || this.balk("You don't see that here.");
        if (!this.combatEngaged) this.socket.emit('message', { type: 'info', value: '*Combat Engaged*' });
        this.combatEngaged = being;
        return being;
      }),
      delay(attack.lead),
      tap((being) => {
        const roll = this.roll(attack.acc);
        const hit = roll >= being.ac;

        if (hit) {
          const damage = this.roll(attack.dmg);
          this.emit('attack', { source: this, target: being, attack, hit, damage });
        } else {
          this.emit('attack', { source: this, target: being, attack, hit });
        }
      }),
      delay(attack.lag),
      tap((being) => {
        if (this.combatEngaged === being) {
          this.process(`attack ${being.name}`);
        }
      }),
    );
  }

  async findItem(target, take = false) {
    return (await this.resolveTarget('items', target, take)) || this.balk("You don't have that on you!");
  }
}
