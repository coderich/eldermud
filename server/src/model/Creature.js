import { of } from 'rxjs';
import { tap, delay, mergeMap, mergeAll } from 'rxjs/operators';
import { roll } from '../service/game.service';
import CreatureStream from '../core/CreatureStream';
import Unit from './Unit';

export default class Creature extends Unit {
  constructor(...args) {
    super(...args);
    this.isCreature = true;
    this.stream$ = new CreatureStream(this);
    // this.process({ type: 'scan' });
  }

  process(data) {
    this.stream$.next(data);
  }

  scan() {
    clearTimeout(this.interval);

    return of('scan').pipe(
      mergeMap(async () => {
        const room = await this.Room();
        const [player] = await room.Players();
        if (player) return this.attack(player);
        return of('chill');
      }),
      mergeAll(), // I think because I'm calling a whole other (this.attack)
      tap((v) => {
        clearTimeout(this.interval);
        if (v === 'chill') this.chill();
      }),
    );
  }

  chill() {
    this.interval = setTimeout(() => {
      this.process({ type: 'scan' });
    }, 5000);
  }

  attack(being) {
    const [attack] = Object.values(this.attacks);

    return of('attack').pipe(
      delay(attack.lead),
      tap(() => {
        const total = roll(attack.acc);
        const hit = total >= being.ac;

        if (hit) {
          const damage = roll(attack.dmg);
          this.emit('attack', { source: this, target: being, attack, hit, damage });
        } else {
          this.emit('attack', { source: this, target: being, attack, hit });
        }
      }),
      delay(attack.lag),
    );
  }

  follow(being) {
    return of('chill');
  }
}
