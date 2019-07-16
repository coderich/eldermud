import { mergeMap } from 'rxjs/operators';
import { getData } from '../service/data.service';
import { translate } from '../service/command.service';
import { createAction } from '../service/StreamService';

export default async (id, target) => {
  return createAction(
    mergeMap(async () => {
      let message;
      const unit = await getData(id);
      const room = await unit.Room();

      if (target) {
        const { code: dir } = translate(target);
        const exit = await room.Exit(dir) || unit.abortAction('There is nothing in that direction!');
        message = await unit.describe('room', exit);
      } else {
        message = await unit.describe('info', room.description);
      }

      return { unit, message };
    }),
  ).listen({
    next: ({ unit, message }) => {
      unit.emit('message', message);
    },
  });
};
