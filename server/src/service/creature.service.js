import { of } from 'rxjs';
import { delay, delayWhen, mergeMap, catchError } from 'rxjs/operators';
import { getData, incData } from './data.service';
import { attackLoop } from './game.service';
import { createLoop, writeStream } from './stream.service';

const loop = id => createLoop(
  mergeMap(async () => {
    const creature = await getData(id);

    // Find a target
    const room = await creature.Room();
    const [player] = await room.Players();
    if (!player) return creature.abortAction('no-targets');

    // Begin attack
    const [attack] = Object.values(creature.attacks);
    return { playerId: player.id, attack };
  }),

  delayWhen(() => attackLoop),

  mergeMap(async ({ playerId, attack }) => {
    const [creature, player] = await Promise.all([getData(id), getData(playerId)]);
    if (creature.room !== player.room) return creature.abortAction('target-fleed');
    if (creature.hp <= 0) return creature.abortAction('dead');

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

  catchError((e) => {
    if (e.message === 'dead') throw e;
    return of(e).pipe(delay(2000));
  }),
);

const creatures = new Set();

export const addCreature = async (id) => {
  if (!creatures.has(id)) {
    creatures.add(id);
    writeStream(id, loop(id));
  }
};

export const removeCreature = (id) => {
  creatures.remove(id);
};
