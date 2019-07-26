import { mergeMap, delay } from 'rxjs/operators';
import { getData } from '../service/data.service';
import { translate } from '../service/command.service';
import { createAction } from '../service/stream.service';

export default async (id, target) => createAction(
  mergeMap(async () => {
    const unit = await getData(id);
    const room = await unit.Room();
    const { code: dir } = translate(target);
    const door = await room.Door(dir) || unit.abortAction('There is nothing in that direction!');
    const keys = await unit.Keys() || unit.abortAction('You have no keys!');
    unit.emit('message', { type: 'info', value: 'Attempting to unlock the door...' });
    return { keys, unit, door };
  }),
  delay(500),
  mergeMap(async ({ keys, unit, door }) => {
    if (keys.some((key) => {
      return key.obstacles.some(obstacle => obstacle === door.id);
    })) {
      const message = await door.unlock(unit);
      unit.emit('message', message);
    } else {
      unit.abortAction('None of your keys work.');
    }
  }),
);
