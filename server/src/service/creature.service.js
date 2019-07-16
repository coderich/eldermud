import { tap, delay } from 'rxjs/operators';
import { getData, setData, incData } from './data.service';
import { writeStream, closeStream, createAction } from './StreamService';

const scan = async (creatureId) => {
  const creature = await getData(creatureId);
  const room = await creature.Room();
  const [player] = await room.Players();
  return player;
};

const battle = async (creatureId, player) => {
  const creature = await getData(creatureId);
  const room = await creature.Room();
  const [attack] = Object.values(creature.attacks);

  return createAction(
    delay(attack.lead),
    tap(() => {
      const total = creature.roll(attack.acc);
      const hit = total >= player.ac;

      if (hit) {
        const damage = creature.roll(attack.dmg);
        incData(player.id, 'hp', -damage);
        player.emit('message', { type: 'error', value: `The ${creature.name} hits you for ${damage} damage!` });
        player.broadcast(room, 'message', { type: 'error', value: `The ${creature.name} hits ${player.name} for ${damage} damage!` });
      } else {
        player.emit('message', { type: 'info', value: `The ${creature.name} swings at you, but misses!` });
        player.broadcast(room, 'message', { type: 'info', value: `The ${creature.name} swings at ${player.name}, but misses!` });
      }
    }),
    delay(attack.lag),
    tap(() => scan(creatureId)),
  ).listen({});
};

const creatures = {};

export const addCreature = (creature) => {
  if (!creatures[creature.id]) {
    creatures[creature.id] = creature;
  }
};

export const removeCreature = (creature) => {
  delete creatures[creature.id];
  closeStream(creature.id);
};

setInterval(() => {
  Object.keys(creatures).forEach(async (id) => {
    const player = await scan(id);
    if (player) writeStream(id, await battle(id, player));
  });
}, 3000);
