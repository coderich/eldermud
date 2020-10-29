import { mergeMap } from 'rxjs/operators';
import { getData } from '../../service/data.service';
import { toRoom } from '../../service/socket.service';
import { createAction } from '../../service/stream.service';
import { resolveTrigger } from '../../service/game.service';

export default async (id, input) => {
  return createAction(
    mergeMap(async () => {
      const unit = await getData(id);
      const room = await unit.Room();

      if (!input) {
        unit.emit('message', { type: 'info', value: 'You greet everyone.' });
        unit.broadcastToRoom(room.id, 'message', { type: 'info', value: `${unit.name} greets everyone.` });
      } else {
        const target = (await room.resolveTarget('units', input, { omit: [id] })) || unit.abortAction('You don\'t see that here.');
        unit.emit('message', { type: 'info', value: `You greet ${target.name}.` });

        if (target.isUser) {
          target.emit('message', { type: 'info', value: `${unit.name} greets you.` });
          toRoom(room, 'message', { type: 'info', value: `${unit.name} greets ${target.name}.` }, { omit: [unit.id, target.id] });
        }

        if (target.isNPC) {
          unit.broadcastToRoom(room.id, 'message', { type: 'info', value: `${unit.name} greets ${target.name}.` });
          const trigger = target.triggers.find(t => t.cmd === 'greet');
          if (trigger) resolveTrigger(room, target, unit, trigger);
        }
      }
    }),
  );
};
