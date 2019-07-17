import { tap, mergeMap, delay, catchError } from 'rxjs/operators';
import { getData, setData, incData } from '../service/data.service';
import { createAction } from '../service/stream.service';

export default async (id, input) => {
  const u = await getData(id);
  const [attack] = Object.values(u.attacks);

  return createAction(
    mergeMap(async () => {
      const unit = await getData(id);
      const room = await unit.Room();
      const target = (await room.resolveTarget('units', input)) || unit.abortAction('You don\'t see that here.');
      if (unit.combatEngaged !== target.id) unit.emit('message', { type: 'info', value: '*Combat Engaged*' });
      await setData(id, 'combatEngaged', target.id);
      return target.id;
    }),
    delay(attack.lead),
    tap(async (targetId) => {
      const [unit, target] = await Promise.all([getData(id), getData(targetId)]);
      if (unit.hp <= 0) unit.abortStream('abort it');
      if (target.hp <= 0) unit.breakAction('*Combat Off*');

      const total = unit.roll(attack.acc);
      const hit = total >= target.ac;

      if (hit) {
        const damage = unit.roll(attack.dmg);
        unit.emit('message', { type: 'error', value: `You hit the ${target.name} for ${damage} damage!` });
        unit.broadcastToRoom(unit.room, 'message', { type: 'error', value: `${unit.name} hits the ${target.name} for ${damage} damage!` });
        const hp = await incData(target.id, 'hp', -damage);
        if (hp <= 0) target.death();
      } else {
        unit.emit('message', { type: 'info', value: `You swing at the ${target.name}, but miss!` });
        unit.broadcastToRoom(unit.room, 'message', { type: 'info', value: `${unit.name} swings at the ${target.name}, but misses!` });
      }
    }),
    delay(attack.lag),
    tap(async (targetId) => {
      const [unit, target] = await Promise.all([getData(id), getData(targetId)]);
      if (target.hp <= 0) unit.breakAction('*Combat Off*');

      // if (this.combatEngaged) {
      //   this.process(`attack ${this.combatEngaged.name}`);
      // }
    }),
    // catchError((e) => {
    //   this.breakAction('*Combat Off*');
    //   if (e instanceof AbortActionError && this.combatEngaged) this.break('*Combat Off*');
    //   throw e;
    // }),
  ).listen({});
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
