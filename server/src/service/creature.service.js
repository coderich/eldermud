import { of } from 'rxjs';
import { tap, delayWhen, mergeMap } from 'rxjs/operators';
import { getData } from './data.service';
import { resolveLoop, alertLoop, addAttack } from './game.service';
import { createLoop, createAction, writeStream } from './stream.service';

const battle = (id, targetId, attack) => {
  const attackStream = `${id}.attack`;
  writeStream(attackStream, 'abort');
  writeStream(attackStream, createAction(
    tap(() => addAttack(id, targetId, attack)),
    delayWhen(() => resolveLoop),
  ));

  return of('wait').pipe(delayWhen(() => resolveLoop));
};

const loop = id => createLoop(
  mergeMap(async () => {
    const unit = await getData(id);
    const room = await unit.Room();
    const players = await room.Players();
    const [attack] = Object.values(unit.attacks);
    return { players, attack };
  }),
  mergeMap(({ players, attack }) => {
    const [player] = players;
    if (player) return battle(id, player.id, attack);
    return of('wait').pipe(delayWhen(() => alertLoop));
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
