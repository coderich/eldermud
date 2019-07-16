import { mergeMap } from 'rxjs/operators';
import { getSocket } from '../service/SocketService';
import { getData } from '../service/data.service';
import { translate } from '../service/CommandService';
import { createAction } from '../service/StreamService';

export default async (id, target) => {
  return createAction(
    mergeMap(async () => {
      const unit = await getData(id);
      const room = await unit.Room();

      if (target) {
        const { code: dir } = translate(target);
        const exit = await room.Exit(dir) || unit.abortAction('There is nothing in that direction!');
        return unit.describe('room', exit);
      }

      return unit.describe('info', room.description);
    }),
  ).listen({
    next: (message) => {
      getSocket(id).emit('message', message);
    },
  });
};
