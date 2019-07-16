import { mergeMap } from 'rxjs/operators';
import { getSocket } from '../service/SocketService';
import { getData } from '../service/DataService';
import { createAction } from '../service/StreamService';

export default async id => createAction(
  mergeMap(async () => {
    const unit = await getData(id);
    const room = await unit.Room();
    const items = await room.search();
    if (!items.length) unit.abortAction('You don\'t notice anything.');
    return unit.describe('info', `You notice: ${await unit.describer.describe('items', items)}`);
  }),
).listen({
  next: (message) => {
    getSocket(id).emit('message', message);
  },
});
