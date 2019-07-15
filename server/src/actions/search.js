import { mergeMap } from 'rxjs/operators';
import { getSocket } from '../service/SocketService';
import { getData } from '../service/DataService';
import { createAction, abortAction } from '../service/StreamService';
import AbortActionError from '../error/AbortActionError';

export default id => createAction(
  mergeMap(async () => {
    const unit = await getData(id);
    const room = await unit.Room();
    const items = await room.search();
    if (!items.length) abortAction('You don\'t notice anything.');
    return unit.describe('info', `You notice: ${await unit.describer.describe('items', items)}`);
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
