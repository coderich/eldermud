import { tap, delay, mergeMap } from 'rxjs/operators';
import { getData, incData } from './data.service';
import { writeStream, closeStream, createAction } from './StreamService';

const scan = async (creatureId) => {
  const creature = await getData(creatureId);
  const room = await creature.Room();
  const [player] = await room.Players();
  return player;
};

const battle = async (attack, creatureId, playerId) => {
  return createAction(
    delay(attack.lead),
    mergeMap(async () => {
      const [creature, player] = await Promise.all([getData(creatureId), getData(playerId)]);
      if (creature.room !== player.room) creature.abortStream('Target not found');

      // Roll
      const total = creature.roll(attack.acc);
      const hit = total >= player.ac;

      if (hit) {
        const damage = creature.roll(attack.dmg);
        incData(player.id, 'hp', -damage);
        player.emit('message', { type: 'error', value: `The ${creature.name} hits you for ${damage} damage!` });
        player.broadcastToRoom(player.room, 'message', { type: 'error', value: `The ${creature.name} hits ${player.name} for ${damage} damage!` });
      } else {
        player.emit('message', { type: 'info', value: `The ${creature.name} swings at you, but misses!` });
        player.broadcastToRoom(player.room, 'message', { type: 'info', value: `The ${creature.name} swings at ${player.name}, but misses!` });
      }

      return hit;
    }),
    delay(attack.lag),
    tap(() => scan(creatureId)),
  ).listen({});
};

const creatures = new Set();

export const addCreature = (id) => {
  if (!creatures.has(id)) {
    creatures.add(id);
  }
};

export const removeCreature = (id) => {
  creatures.remove(id);
  closeStream(id);
};

setInterval(() => {
  creatures.forEach(async (id) => {
    const creature = await getData(id);
    const player = await scan(id);
    if (player) writeStream(id, await battle(Object.values(creature.attacks)[0], id, player.id));
  });
}, 3000);
