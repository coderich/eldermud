import { mergeMap } from 'rxjs/operators';
import { getData } from '../service/data.service';
import { translate } from '../service/command.service';
import { createAction } from '../service/stream.service';

export default async (id, target) => {
  return createAction(
    mergeMap(async () => {
      let message;
      const unit = await getData(id);
      const room = await unit.Room();

      if (target) {
        const { code: dir } = translate(target);
        const exit = await room.Exit(dir) || unit.abortAction('There is nothing in that direction!');
        const obstacles = await room.Obstacle(dir);
        if (obstacles && obstacles.some(obstacle => obstacle.blocksVision())) unit.abortAction('Your vision is obstructed!');
        message = await unit.describe('room', exit, { full: true });
      } else {
        message = await unit.describe('room', room, { full: true });
      }

      unit.emit('message', message);
    }),
  );
};
