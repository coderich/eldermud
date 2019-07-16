import AbortActionError from '../error/AbortActionError';
import { getSocket } from '../service/SocketService';
import Describer from '../core/Describer';
import { emit } from '../service/event.service';
import Unit from './Unit';

export default class User extends Unit {
  constructor(...args) {
    super(...args);
    this.isUser = true;
    this.timeout = ms => new Promise(res => setTimeout(res, ms));
    this.describer = new Describer(this.id, this.getData);
    this.emit = emit;
    this.socket = getSocket(this.id);
  }

  abortAction(value) {
    this.socket.emit('message', { type: 'error', value });
    throw new AbortActionError(value);
  }

  async describe(type, obj) {
    return { type, value: await this.describer.describe(type, obj) };
  }

  // attack(target) {
  //   const [attack] = Object.values(this.attacks);

  //   return of('attack').pipe(
  //     mergeMap(async () => {
  //       const room = await this.Room();
  //       const being = (await room.resolveTarget('beings', target)) || this.abortAction("You don't see that here.");
  //       if (!this.combatEngaged) this.socket.emit('message', { type: 'info', value: '*Combat Engaged*' });
  //       this.combatEngaged = being;
  //       return being;
  //     }),
  //     delay(attack.lead),
  //     tap((being) => {
  //       if (being.hp <= 0) this.break('*Combat Off*');
  //       const total = roll(attack.acc);
  //       const hit = total >= being.ac;

  //       if (hit) {
  //         const damage = roll(attack.dmg);
  //         this.emit('attack', { source: this, target: being, attack, hit, damage });
  //       } else {
  //         this.emit('attack', { source: this, target: being, attack, hit });
  //       }
  //     }),
  //     delay(attack.lag),
  //     tap((being) => {
  //       if (being.hp <= 0) this.break('*Combat Off*');

  //       if (this.combatEngaged) {
  //         this.process(`attack ${this.combatEngaged.name}`);
  //       }
  //     }),
  //     catchError((e) => {
  //       if (e instanceof AbortActionError && this.combatEngaged) this.break('*Combat Off*');
  //       throw e;
  //     }),
  //   );
  // }
}
