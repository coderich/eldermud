import { mergeMap } from 'rxjs/operators';
import { getSocket } from '../service/SocketService';
import { getData } from '../service/DataService';
import { translate } from '../service/CommandService';
import { createAction, abortAction } from '../service/StreamService';
import AbortActionError from '../error/AbortActionError';

export default (id, target) => createAction(
  mergeMap(async () => {
    const unit = await getData(id);
    const room = await unit.Room();
    const { code: dir } = translate(target);
    const door = await room.Door(dir) || abortAction('There is nothing in that direction!');
    return door.close();
  }),
).listen({
  next: (message) => {
    getSocket(id).emit('message', message);
  },
  error: (e) => {
    if (e instanceof AbortActionError) {
      getSocket(id).emit('message', { type: 'error', value: e.message });
    }
  },
});
