import { mergeMap } from 'rxjs/operators';
import { getSocket } from '../service/SocketService';
import { getData } from '../service/DataService';
import { createAction, abortAction } from '../service/StreamService';
import AbortActionError from '../error/AbortActionError';

export default (id, command, dir) => createAction(
  mergeMap(async () => {
    const unit = await getData(id);

    if (dir.scope === 'navigation') {
      const target = command.args.slice(0, -1).join(' ');
      const item = await unit.resolveTarget('items', target) || abortAction('You don\'t have that on you!');
      const room = await unit.Room();
      const door = await room.Door(dir.code) || abortAction('There is nothing in that direction!');
      return item.use(door);
    }

    const target = command.args.join(' ');
    const item = await unit.resolveTarget('items', target) || abortAction('You don\'t have that on you!');
    return item.use();
  }),
).listen({
  next: (message) => {
    getSocket(id).emit('message', message);
  },
  error: (e) => {
    if (e instanceof AbortActionError) {
      getSocket(id).emit('message', { type: 'error', value: e.message });
    }
  },
});
