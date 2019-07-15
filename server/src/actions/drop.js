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
    const item = await unit.resolveTarget('items', target) || balk('You don\'t have that on you!');
    await pullData(unit.id, 'items', item.id);
    await pushData(room.id, 'items', item.id);
    return { unit, item };
  }),
).listen({
  next: async ({ unit, item }) => {
    const message = await unit.describe('info', `You dropped ${item.name}.`);
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
