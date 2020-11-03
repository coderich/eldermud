import { mergeMap } from 'rxjs/operators';
import { getData, incData, pushData } from '../../service/data.service';
import { createAction } from '../../service/stream.service';
import { gameEmitter } from '../../service/event.service';
import { createItem } from '../../service/game.service';

export default (id, target) => createAction(
  mergeMap(async () => {
    const unit = await getData(id);
    const room = await unit.Room();
    const shop = await room.Shop() || unit.abortAction('There is no shop here!');
    const template = await shop.resolveTarget('items', target) || unit.abortAction('Item not available. Type "list" to see available items.');
    if (template.cost > unit.exp) unit.breakAction('You do not have sufficient focus.');

    const event = { unit, room, shop };
    gameEmitter.emit('pre:buy', event);
    const item = await createItem(template);
    await Promise.all([incData(unit.id, 'exp', -template.cost), pushData(unit.id, 'items', item.id)]);
    gameEmitter.emit('post:buy', event);
    unit.emit('message', { type: 'info', value: `You expend ${template.cost} focus to obtain the ${item.name}.` });
    unit.status();
  }),
);
