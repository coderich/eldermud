import { mergeMap } from 'rxjs/operators';
import { getData, incData, pullData } from '../../service/data.service';
import { createAction } from '../../service/stream.service';

export default async (id, target) => createAction(
  mergeMap(async () => {
    const unit = await getData(id);
    const room = await unit.Room();
    const shop = await room.Shop() || unit.abortAction('There is no shop here!');
    const item = await unit.resolveTarget('items', target) || unit.abortAction('You don\'t have that on you!');
    const template = await shop.resolveTarget('items', target) || unit.abortAction('Cannot sell that here!');
    const itemId = await pullData(unit.id, 'items', item.id);
    if (!itemId) unit.abortAction('You no longer have that on you!');
    const price = Math.round(template.cost / 2);
    await incData(unit.id, 'exp', price);
    unit.emit('message', { type: 'info', value: `You sold ${item.name} for ${price}` });
    unit.status();
  }),
);
