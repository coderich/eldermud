import { mergeMap } from 'rxjs/operators';
import { getData } from '../service/data.service';
import { createAction } from '../service/StreamService';

export default async id => createAction(
  mergeMap(async () => {
    const unit = await getData(id);
    const room = await unit.Room();
    const items = await room.search();
    if (!items.length) unit.abortAction('You don\'t notice anything.');
    const message = await unit.describe('info', `You notice: ${await unit.describer.describe('items', items)}`);
    return { unit, message };
  }),
).listen({
  next: ({ unit, message }) => {
    unit.emit('message', message);
  },
});
