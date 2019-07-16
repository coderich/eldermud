import { mergeMap } from 'rxjs/operators';
import { getData } from '../service/data.service';
import { createAction } from '../service/StreamService';

export default async (id, phrase) => createAction(
  mergeMap(async () => {
    const unit = await getData(id);
    const room = await unit.Room();
    return { unit, room };
  }),
).listen({
  next: ({ unit, room }) => {
    const message = unit.describe('info', `You say "${phrase}"`);
    unit.emit('message', message);
  },
});
