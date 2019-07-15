import { mergeMap, delay } from 'rxjs/operators';
import { getSocket } from '../service/SocketService';
import { getData, setData, pushData, pullData } from '../service/DataService';
import { createAction, abortAction } from '../service/StreamService';
import AbortActionError from '../error/AbortActionError';

export default (id, dir) => createAction(
  mergeMap(async () => {
    const unit = await getData(id);
    const room = await unit.Room();
    const exit = await room.Exit(dir) || abortAction('There is no exit in that direction!');
    const obstacles = await room.Obstacle(dir);
    if (obstacles && !obstacles.some(obstacle => obstacle.resolve())) abortAction('There is an obstacle in your way!');
    return { unit, from: room, to: exit };
  }),
  delay(1000),
  mergeMap(async ({ unit, from, to }) => {
    await Promise.all([setData(id, 'room', to.id), pushData(to.id, 'units', unit.id), pullData(from.id, 'units', unit.id)]);
    return { unit, from, to };
  }),
).listen({
  next: async ({ unit, from, to }) => {
    if (unit.isUser) {
      const message = await unit.describe('room', to);
      getSocket(id).emit('message', message);
    }
  },
  error: (e) => {
    if (e instanceof AbortActionError) {
      getSocket(id).emit('message', { type: 'error', value: e.message });
    }
  },
});
