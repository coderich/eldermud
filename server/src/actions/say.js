import { mergeMap } from 'rxjs/operators';
import { getSocket } from '../service/SocketService';
import { getData } from '../service/DataService';
import { createAction } from '../service/StreamService';

export default (id, phrase) => createAction(
  mergeMap(async () => {
    const unit = await getData(id);
    const room = await unit.Room();
    return { unit, room, phrase };
  }),
).listen({
  next: ({ unit, room, phrase }) => {
    const message = unit.describe('info', `You say "${phrase}"`);
    getSocket(id).emit('message', message);
  },
});
