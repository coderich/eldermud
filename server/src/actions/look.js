import { mergeMap } from 'rxjs/operators';
import { getSocket } from '../service/SocketService';
import { getData } from '../service/DataService';
import { translate } from '../service/CommandService';
import { createAction } from '../service/StreamService';

const AbortActionError = class extends Error {};
const balk = (msg) => { throw new AbortActionError(msg); };

export default (id, target) => {
  return createAction(
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
  ).listen({
    next: (message) => {
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
};
