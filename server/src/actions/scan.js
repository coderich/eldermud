import { mergeMap } from 'rxjs/operators';
import { getData } from '../service/data.service';
import { createAction } from '../service/stream.service';

export default async id => createAction(
  mergeMap(async () => {
    const unit = await getData(id);
    const room = await unit.Room();
    const message = await unit.describe('room', room);
    return { unit, message };
  }),
).listen({
  next: ({ unit, message }) => {
    unit.emit('message', message);
  },
});
