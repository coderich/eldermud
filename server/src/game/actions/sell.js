import { mergeMap } from 'rxjs/operators';
import { getData, incData, pullData, delData } from '../../service/data.service';
import { createAction } from '../../service/stream.service';

export default async (id, target) => createAction(
  mergeMap(async () => {
    const unit = await getData(id);
    const room = await unit.Room();
    const shop = await room.Shop() || unit.abortAction('There is no shop here!');
    const item = await unit.resolveTarget('items', target) || unit.abortAction('You don\'t have that on you!');
    const template = await shop.resolveTarget('items', target) || unit.abortAction('Cannot sell that here!');
    const price = Math.round(template.cost / 2);
    await Promise.all([
      incData(unit.id, 'exp', price),
      pullData(unit.id, 'items', item.id),
      pullData(unit.id, 'equipped', item.id),
      delData(item.id),
      unit.emit('message', { type: 'info', value: `You sold ${item.name} for ${price}` }),
      unit.status(),
      unit.stats(),
    ]);
  }),
);
