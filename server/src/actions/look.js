import { Subject } from 'rxjs';
import { mergeMap, take, share } from 'rxjs/operators';
import { getSocket } from '../service/SocketService';
import { getData } from '../service/DataService';
import { translate } from '../service/CommandService';

const AbortActionError = class extends Error {};
const balk = (msg) => { throw new AbortActionError(msg); };

export default (id, target) => {
  const stream = new Subject().pipe(
    mergeMap(async () => {
      const unit = await getData(id);
      const room = await unit.Room();

      if (target) {
        const { code: dir } = translate(target);
        const exit = await room.Exit(dir) || balk('There is nothing in that direction!');
        return unit.describe('room', exit);
      }

      return unit.describe('info', room.description);
    }),
    take(1),
    share(),
  );

  const socket = getSocket(id);

  stream.subscribe({
    next: (message) => {
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
    stream.next({ id, target });
    return stream;
  };
};
