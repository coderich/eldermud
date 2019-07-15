import { of } from 'rxjs';
import { tap, delay, mergeMap, catchError } from 'rxjs/operators';
import UserStream from '../core/UserStream';
import AbortActionError from '../error/AbortActionError';
import Being from './Being';

export default class User extends Being {
  constructor(...args) {
    super(...args);
    this.isUser = true;
    this.stream$ = new UserStream(this);

    // setInterval(() => {
    //   if (this.hp < this.mhp) {
    //     this.hp++;
    //     this.emit('status', { being: this });
    //   }
    // }, 1500);
  }

  process(data) {
    this.stream$.next(data);
  }

  break(msg) {
    if (this.combatEngaged) {
      this.combatEngaged = null;
      this.interrupt(msg);
    }
  }

  attack(target) {
    const [attack] = Object.values(this.attacks);

    return of('attack').pipe(
      mergeMap(async () => {
        const room = await this.Room();
        const being = (await room.resolveTarget('beings', target)) || this.abortAction("You don't see that here.");
        if (!this.combatEngaged) this.socket.emit('message', { type: 'info', value: '*Combat Engaged*' });
        this.combatEngaged = being;
        return being;
      }),
      delay(attack.lead),
      tap((being) => {
        if (being.hp <= 0) this.break('*Combat Off*');
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
        if (being.hp <= 0) this.break('*Combat Off*');

        if (this.combatEngaged) {
          this.process(`attack ${this.combatEngaged.name}`);
        }
      }),
      catchError((e) => {
        if (e instanceof AbortActionError && this.combatEngaged) this.break('*Combat Off*');
        throw e;
      }),
    );
  }

  async findItem(target, take = false) {
    return (await this.resolveTarget('items', target, take)) || this.abortAction("You don't have that on you!");
  }
}
