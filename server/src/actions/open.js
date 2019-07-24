import { mergeMap } from 'rxjs/operators';
import { getData } from '../service/data.service';
import { translate } from '../service/command.service';
import { createAction } from '../service/stream.service';

export default async (id, target) => createAction(
  mergeMap(async () => {
    const unit = await getData(id);
    const room = await unit.Room();
    const { code: dir } = translate(target);
    const door = await room.Door(dir) || unit.abortAction('There is nothing in that direction!');
    const message = await door.open(unit);
    unit.emit('message', message);
    unit.minimap();
  }),
);
