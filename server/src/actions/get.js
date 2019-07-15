import { Subject } from 'rxjs';
import { mergeMap, take, share } from 'rxjs/operators';
import { getSocket } from '../service/SocketService';
import { getData, pushData, pullData } from '../service/DataService';

const AbortActionError = class extends Error {};
const balk = (msg) => { throw new AbortActionError(msg); };

export default (id, target) => {
  const stream = new Subject().pipe(
    mergeMap(async () => {
      const unit = await getData(id);
      const room = await unit.Room();
      const item = await room.resolveTarget('items', target) || balk('You don\'t see that here!');
      await pullData(room.id, 'items', item.id);
      await pushData(unit.id, 'items', item.id);
      return { unit, item };
    }),
    take(1),
    share(),
  );

  const socket = getSocket(id);

  stream.subscribe({
    next: async ({ unit, item }) => {
      const message = await unit.describe('info', `You took ${item.name}.`);
      socket.emit('message', message);
    },
    error: (e) => {
      if (e instanceof AbortActionError) {
        socket.emit('message', { type: 'error', value: e.message });
      } else {
        console.log(e);
      }
    },
  });

  return () => {
    stream.next({ id });
    return stream;
  };
};
