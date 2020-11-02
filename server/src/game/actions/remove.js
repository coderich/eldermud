import { mergeMap } from 'rxjs/operators';
import { getData, pullData } from '../../service/data.service';
import { createAction } from '../../service/stream.service';
import { breakAttack } from '../../service/game.service';

export default (id, target) => createAction(
  mergeMap(async () => {
    const unit = await getData(id);
    const item = await unit.resolveTarget('items', target) || unit.abortAction('You don\'t have that on you!');
    const equipped = await unit.Equipped();
    if (!equipped.find(eq => eq.id === item.id)) unit.abortAction('Not equipped!');

    await Promise.all([
      breakAttack(unit.id),
      pullData(id, 'equipped', item.id),
    ]);

    unit.emit('message', { type: 'info', value: `You remove ${item.name}.` });
    unit.stats();
  }),
);
