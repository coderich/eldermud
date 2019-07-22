import { tap, mergeMap, delayWhen } from 'rxjs/operators';
import { getData } from '../service/data.service';
import { createAction, createLoop, writeStream } from '../service/stream.service';
import { resolveLoop, addAttack } from '../service/game.service';

export default async (id, input) => {
  const { attacks } = await getData(id);
  const [attack] = Object.values(attacks);

  return createAction(
    mergeMap(async () => {
      const unit = await getData(id);
      const room = await unit.Room();
      const target = (await room.resolveTarget('units', input, { omit: [id] })) || unit.abortAction('You don\'t see that here.');
      unit.emit('message', { type: 'info', value: '*Combat Engaged*' });
      if (target.isUser) target.emit('message', { type: 'info', value: `${unit.name} moves to attack you!` });
      return target.id;
    }),
    tap((targetId) => {
      const attackStream = `${id}.attack`;
      writeStream(attackStream, 'abort');
      writeStream(attackStream, createLoop(
        tap(async () => {
          addAttack(id, targetId, attack);
        }),
        delayWhen(() => resolveLoop),
        mergeMap(async () => {
          const [unit, target] = await Promise.all([getData(id), getData(targetId)]);
          if (!target || unit.room !== target.room) unit.breakAction('*Combat Off*');
        }),
      ));
    }),
  );
};
