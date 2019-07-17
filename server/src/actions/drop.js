import { mergeMap } from 'rxjs/operators';
import { getData, pushData, pullData } from '../service/data.service';
import { createAction } from '../service/stream.service';

export default async (id, target) => createAction(
  mergeMap(async () => {
    const unit = await getData(id);
    const room = await unit.Room();
    const item = await unit.resolveTarget('items', target) || unit.abortAction('You don\'t have that on you!');
    const itemId = await pullData(unit.id, 'items', item.id) || unit.abortAction('You no longer have that on you!');
    await pushData(room.id, 'items', itemId);
    const message = await unit.describe('info', `You dropped ${item.name}.`);
    unit.emit('message', message);
  }),
);
