import { mergeMap } from 'rxjs/operators';
import { getSocket } from '../service/SocketService';
import { getData, pushData, pullData } from '../service/DataService';
import { createAction } from '../service/StreamService';

export default (id, target) => createAction(
  mergeMap(async () => {
    const unit = await getData(id);
    const room = await unit.Room();
    const item = await unit.resolveTarget('items', target) || unit.abortAction('You don\'t have that on you!');
    const itemId = await pullData(unit.id, 'items', item.id) || unit.abortAction('You no longer have that on you!');
    await pushData(room.id, 'items', itemId);
    return { unit, item };
  }),
).listen({
  next: async ({ unit, item }) => {
    const message = await unit.describe('info', `You dropped ${item.name}.`);
    getSocket(id).emit('message', message);
  },
});
