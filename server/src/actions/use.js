import { mergeMap } from 'rxjs/operators';
import { getData } from '../service/data.service';
import { createAction } from '../service/StreamService';

export default async (id, command, dir) => createAction(
  mergeMap(async () => {
    let message;
    const unit = await getData(id);

    if (dir.scope === 'navigation') {
      const target = command.args.slice(0, -1).join(' ');
      const item = await unit.resolveTarget('items', target) || unit.abortAction('You don\'t have that on you!');
      const room = await unit.Room();
      const door = await room.Door(dir.code) || unit.abortAction('There is nothing in that direction!');
      message = await item.use(unit, door);
    } else {
      const target = command.args.join(' ');
      const item = await unit.resolveTarget('items', target) || unit.abortAction('You don\'t have that on you!');
      message = await item.use(unit);
    }

    return { unit, message };
  }),
).listen({
  next: ({ unit, message }) => {
    unit.emit('message', message);
  },
});
