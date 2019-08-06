import { mergeMap } from 'rxjs/operators';
import { getData } from '../../service/data.service';
import { createAction } from '../../service/stream.service';

export default async (id, target) => createAction(
  mergeMap(async () => {
    const unit = await getData(id);
    const item = await unit.resolveTarget('items', target) || unit.abortAction('You don\'t have that on you!');
    const message = await unit.describe('info', `You equip ${item.name}.`);
    unit.emit('message', message);
  }),
);
