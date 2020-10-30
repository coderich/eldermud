import { mergeMap } from 'rxjs/operators';
import { getData, incData, pushData } from '../../service/data.service';
import { createAction } from '../../service/stream.service';
import { createItem } from '../../service/game.service';

export default async (id, target) => createAction(
  mergeMap(async () => {
    const unit = await getData(id);
    const room = await unit.Room();
    const shop = await room.Shop() || unit.abortAction('There is no shop here!');
    const template = await shop.resolveTarget('items', target) || unit.abortAction('Item not available. Type "list" to see available items.');
    if (template.cost > unit.exp) unit.breakAction('You do not have sufficient funds.');
    const item = await createItem(template);
    await Promise.all([incData(unit.id, 'exp', -template.cost), pushData(unit.id, 'items', item.id)]);
    unit.emit('message', { type: 'info', value: `You buy ${item.name} for ${template.cost} souls.` });
    unit.status();
  }),
);
