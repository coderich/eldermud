import { mergeMap } from 'rxjs/operators';
import { getSocket } from '../service/SocketService';
import { getData } from '../service/data.service';
import { createAction } from '../service/StreamService';

export default async id => createAction(
  mergeMap(async () => {
    const unit = await getData(id);
    const room = await unit.Room();
    return unit.describe('room', room);
  }),
).listen({
  next: (message) => {
    getSocket(id).emit('message', message);
  },
});
