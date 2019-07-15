import { mergeMap } from 'rxjs/operators';
import { getSocket } from '../service/SocketService';
import { getData, pushData, pullData } from '../service/DataService';
import { createAction } from '../service/StreamService';

const AbortActionError = class extends Error {};
const balk = (msg) => { throw new AbortActionError(msg); };

export default (id, target) => createAction(
  mergeMap(async () => {
    const unit = await getData(id);
    const room = await unit.Room();
    const item = await room.resolveTarget('items', target) || balk('You don\'t see that here!');
    const itemId = await pullData(room.id, 'items', item.id) || balk('You no longer see that here!');
    await pushData(unit.id, 'items', itemId);
    return { unit, item };
  }),
).listen({
  next: async ({ unit, item }) => {
    const message = await unit.describe('info', `You took ${item.name}.`);
    getSocket(id).emit('message', message);
  },
  error: (e) => {
    if (e instanceof AbortActionError) {
      getSocket(id).emit('message', { type: 'error', value: e.message });
    } else {
      console.log(e);
    }
  },
});
