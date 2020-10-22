import { mergeMap, delay } from 'rxjs/operators';
import { getData, setData, pushData, pullData } from '../../service/data.service';
import { createAction } from '../../service/stream.service';
import { directions, rdirections } from '../../service/util.service';

export default async (id, dir, name) => createAction(
  mergeMap(async () => {
    const unit = await getData(id);
    const room = await unit.Room();
    const exit = await room.Exit(dir) || unit.abortAction('There is no exit in that direction!');
    const obstacles = await room.Obstacle(dir);
    if (obstacles && !obstacles.some(obstacle => obstacle.resolve())) unit.abortAction('There is an obstacle in your way!');
    unit.emit('message', { type: 'info', value: `moving ${name}...` });
    return { unit, from: room, to: exit };
  }),
  delay(1000),
  mergeMap(async ({ unit, from, to }) => {
    await Promise.all([setData(id, 'room', to.id), pushData(to.id, 'units', unit.id), pullData(from.id, 'units', unit.id)]);
    if (unit.isUser) {
      const message = await unit.describe('room', to);
      unit.emit('message', message);
      unit.broadcastToRoom(to.id, 'message', { type: 'enter', value: { name: unit.name, type: unit.type, from: rdirections[dir] } });
      unit.broadcastToRoom(from.id, 'message', { type: 'leave', value: { name: unit.name, type: unit.type, to: directions[dir] } });
      unit.minimap(to);
    }
  }),
);