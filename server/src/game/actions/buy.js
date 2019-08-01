import { mergeMap } from 'rxjs/operators';
import { getData, incData, pushData } from '../../service/data.service';
import { createAction } from '../../service/stream.service';

export default async (id, target) => createAction(
  mergeMap(async () => {
    const unit = await getData(id);
    const room = await unit.Room();
    const shop = await room.Shop() || unit.abortAction('There is no shop here!');
    const template = await shop.resolveTarget('items', target) || unit.abortAction('This shop does not carry that item!');
    if (template.cost > unit.exp) unit.breakAction('Insufficient power.');
    const item = await shop.createItem(template);
    await Promise.all([incData(unit.id, 'exp', -template.cost), pushData(unit.id, 'items', item.id)]);
    unit.emit('message', { type: 'info', value: `You just bought ${item.name}` });
    unit.status();
  }),
);
