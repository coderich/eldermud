import { mergeMap, delay } from 'rxjs/operators';
import { getSocket } from '../service/SocketService';
import { getData } from '../service/DataService';
import { createAction } from '../service/StreamService';

export default async (id, target) => {
  const u = await getData(id);
  const [attack] = Object.values(u.attacks);

  return createAction(
    mergeMap(async () => {
      const unit = await getData(id);
      const room = await unit.Room();
      const enemy = (await room.resolveTarget('units', target)) || unit.abortAction('You don\'t see that here.');
      return { unit, enemy, attack };
    }),
    delay(attack.lead),
    delay(attack.lag),
  ).listen({
    next: (message) => {
      getSocket(id).emit('message', message);
    },
  });
};


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
