import { of } from 'rxjs';
import { delay, map, concatMap, mergeMap, publish, retry, take, catchError } from 'rxjs/operators';
import { getData, incData } from './data.service';

const loop = (id) => {
  const action = of(id).pipe(
    mergeMap(async () => {
      // Death check
      const creature = await getData(id);
      if (!creature || creature.hp <= 0) return creature.abortAction('dead');

      // Find a target
      const room = await creature.Room();
      const [player] = await room.Players();
      if (!player) return creature.abortAction('no-targets');

      // Begin attack
      const [attack] = Object.values(creature.attacks);
      return { playerId: player.id, attack };
    }),

    concatMap(args => of(args).pipe(delay(args.attack.lead))),

    mergeMap(async ({ playerId, attack }) => {
      const [creature, player] = await Promise.all([getData(id), getData(playerId)]);
      if (creature.room !== player.room) return creature.abortAction('target-fleed');

      // Roll the dice
      const total = creature.roll(attack.acc);
      const hit = total >= player.ac;

      // Outcome
      if (hit) {
        const damage = creature.roll(attack.dmg);
        player.emit('message', { type: 'error', value: `The ${creature.name} hits you for ${damage} damage!` });
        player.broadcastToRoom(player.room, 'message', { type: 'error', value: `The ${creature.name} hits ${player.name} for ${damage} damage!` });
        const hp = await incData(player.id, 'hp', -damage);
        if (hp <= 0) player.death();
      } else {
        player.emit('message', { type: 'info', value: `The ${creature.name} swings at you, but misses!` });
        player.broadcastToRoom(player.room, 'message', { type: 'info', value: `The ${creature.name} swings at ${player.name}, but misses!` });
      }

      return { creature, attack };
    }),

    concatMap(args => of(args).pipe(delay(args.attack.lag))),

    map(({ creature }) => creature.abortAction('repeat')),

    catchError((e) => {
      return of(e).pipe(
        delay(1000),
        map(() => {
          if (e.message === 'dead') return 'dead';
          throw e;
        }),
      );
    }),

    take(1), // If we get here, we're dead!
    retry(),
    publish(),
  );

  action.connect();
};

const creatures = new Set();

export const addCreature = async (id) => {
  if (!creatures.has(id)) {
    creatures.add(id);
    loop(id);
  }
};

export const removeCreature = (id) => {
  creatures.remove(id);
};
