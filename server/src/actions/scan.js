import { Subject } from 'rxjs';
import { mergeMap, take, share } from 'rxjs/operators';
import { getSocket } from '../service/SocketService';
import { getData } from '../service/DataService';

export default (id) => {
  const stream = new Subject().pipe(
    mergeMap(async () => {
      const unit = await getData(id);
      const room = await unit.Room();
      return unit.describe('room', room);
    }),
    take(1),
    share(),
  );

  const socket = getSocket(id);

  stream.subscribe({
    next: (message) => {
      socket.emit('message', message);
    },
  });

  return () => {
    stream.next({ id });
    return stream;
  };
};
