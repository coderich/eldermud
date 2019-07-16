import { mergeMap } from 'rxjs/operators';
import { getData } from '../service/data.service';
import { createAction } from '../service/StreamService';

export default async id => createAction(
  mergeMap(async () => {
    const unit = await getData(id);
    const items = await unit.Items();
    const description = items.length === 0 ? 'nothing!' : items.map(item => item.name).join(', ');
    const message = await unit.describe('info', `You are carrying: ${description}`);
    return { unit, message };
  }),
).listen({
  next: ({ unit, message }) => {
    unit.emit('message', message);
  },
});
