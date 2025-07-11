import { mergeMap } from 'rxjs/operators';
import { getData, pushData, pullData } from '../../service/data.service';
import { createAction } from '../../service/stream.service';

export default (id, target) => createAction(
  mergeMap(async () => {
    const unit = await getData(id);
    const room = await unit.Room();
    const item = await room.resolveTarget('items', target) || unit.abortAction('You don\'t see that here!');
    const itemId = await pullData(room.id, 'items', item.id) || unit.abortAction('You no longer see that here!');
    await pushData(unit.id, 'items', itemId);
    const message = await unit.describe('info', `You took ${item.name}.`);
    unit.emit('message', message);
  }),
);
