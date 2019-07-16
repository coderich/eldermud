import { mergeMap } from 'rxjs/operators';
import { getSocket } from '../service/SocketService';
import { getData } from '../service/DataService';
import { createAction } from '../service/StreamService';

export default (id, command, dir) => createAction(
  mergeMap(async () => {
    const unit = await getData(id);

    if (dir.scope === 'navigation') {
      const target = command.args.slice(0, -1).join(' ');
      const item = await unit.resolveTarget('items', target) || unit.abortAction('You don\'t have that on you!');
      const room = await unit.Room();
      const door = await room.Door(dir.code) || unit.abortAction('There is nothing in that direction!');
      return item.use(unit, door);
    }

    const target = command.args.join(' ');
    const item = await unit.resolveTarget('items', target) || unit.abortAction('You don\'t have that on you!');
    return item.use(unit);
  }),
).listen({
  next: (message) => {
    getSocket(id).emit('message', message);
  },
});
