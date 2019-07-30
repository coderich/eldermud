import { mergeMap } from 'rxjs/operators';
import { getData } from '../../service/data.service';
import { createAction } from '../../service/stream.service';

export default async (id, phrase) => createAction(
  mergeMap(async () => {
    const unit = await getData(id);
    unit.emit('message', { type: 'info', value: `You say "${phrase}"` });
    unit.broadcastToRoom(unit.room, 'message', { type: 'info', value: `${unit.name} says "${phrase}"` });
  }),
);
