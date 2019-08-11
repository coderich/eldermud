import { mergeMap } from 'rxjs/operators';
import { getData, pushData, pullData } from '../../service/data.service';
import { createAction } from '../../service/stream.service';
import { breakAttack } from '../../service/game.service';

export default async (id, target) => createAction(
  mergeMap(async () => {
    const unit = await getData(id);
    const room = await unit.Room();
    const item = await unit.resolveTarget('items', target) || unit.abortAction('You don\'t have that on you!');

    await Promise.all([
      breakAttack(unit.id),
      pushData(room.id, 'items', item.id),
      pullData(unit.id, 'items', item.id),
      pullData(unit.id, 'equipped', item.id),
    ]);

    unit.emit('message', { type: 'info', value: `You dropped ${item.name}.` });
    unit.stats();
  }),
);
