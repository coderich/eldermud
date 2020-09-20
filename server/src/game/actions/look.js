import { mergeMap } from 'rxjs/operators';
import { getData } from '../../service/data.service';
import { translate } from '../../service/command.service';
import { createAction } from '../../service/stream.service';

export default async (id, input) => {
  return createAction(
    mergeMap(async () => {
      let message;
      const unit = await getData(id);
      const room = await unit.Room();

      if (input) {
        const { code: dir } = translate(input);

        if (dir !== 'unk') {
          const exit = await room.Exit(dir) || unit.abortAction('There is nothing in that direction!');
          const obstacles = await room.Obstacle(dir);
          if (obstacles && obstacles.some(obstacle => obstacle.blocksVision())) unit.abortAction('Your vision is obstructed!');
          message = await unit.describe('room', exit, { full: true });
        } else {
          const target = (await room.resolveTarget('units', input)) || unit.abortAction('You don\'t see that here.');
          message = await unit.describe('unit', target);
        }
      } else {
        message = await unit.describe('room', room, { full: true });
      }

      unit.emit('message', message);
    }),
  );
};
