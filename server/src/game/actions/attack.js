import { tap, mergeMap, delayWhen } from 'rxjs/operators';
import { getData, setData } from '../../service/data.service';
import { createAction, createLoop, writeStream } from '../../service/stream.service';
import { resolveLoop, addAttack } from '../../service/game.service';

const isValidRoomTarget = async (unit) => {
  const room = await unit.Room();
  const units = await Promise.all(room.units.map(id => getData(id)));

  for (let i = 0; i < units.length; i++) {
    if (units[i].isCreature) return true;
  }

  return false;
};

export default async (id, input, attack) => {
  return createAction(
    mergeMap(async () => {
      const unit = await getData(id);
      const room = await unit.Room();

      switch (attack.scope) {
        case 'room': {
          if (!await isValidRoomTarget(unit)) unit.abortAction('No targets available!');
          unit.emit('message', { type: 'info', value: '*Combat Engaged*' });
          unit.broadcastToRoom(unit.room, 'message', { type: 'info', value: 'Moves to attack the room...' });
          return 'room';
        }
        default: {
          const target = (await room.resolveTarget('units', input, { omit: [id] })) || unit.abortAction('You don\'t see that here.');
          unit.emit('message', { type: 'info', value: '*Combat Engaged*' });
          if (target.isUser) target.emit('message', { type: 'info', value: `${unit.name} moves to attack you!` });
          return target.id;
        }
      }
    }),
    tap((targetId) => {
      const attackStream = `${id}.attack`;
      writeStream(attackStream, 'abort');
      writeStream(attackStream, createLoop(
        tap(async () => {
          addAttack(id, targetId, attack);
          setData(id, 'target', targetId);
        }),
        delayWhen(() => resolveLoop),
        mergeMap(async () => {
          const [unit, target] = await Promise.all([getData(id), getData(targetId)]);
          if (attack.scope === 'room' && !await isValidRoomTarget(unit)) unit.break('*Combat Off*');
          if (!attack.scope === 'room' && (!target || unit.room !== target.room)) unit.break('*Combat Off*');
        }),
      ));
    }),
  );
};
