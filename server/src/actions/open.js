import { mergeMap } from 'rxjs/operators';
import { getSocket } from '../service/SocketService';
import { getData } from '../service/DataService';
import { translate } from '../service/CommandService';
import { createAction } from '../service/StreamService';

export default async (id, target) => createAction(
  mergeMap(async () => {
    const unit = await getData(id);
    const room = await unit.Room();
    const { code: dir } = translate(target);
    const door = await room.Door(dir) || unit.abortAction('There is nothing in that direction!');
    return door.open(unit);
  }),
).listen({
  next: (message) => {
    getSocket(id).emit('message', message);
  },
});
