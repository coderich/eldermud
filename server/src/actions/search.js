import { mergeMap } from 'rxjs/operators';
import { getData } from '../service/data.service';
import { createAction } from '../service/stream.service';

export default async id => createAction(
  mergeMap(async () => {
    const unit = await getData(id);
    const room = await unit.Room();
    const items = await room.search();
    if (!items.length) unit.abortAction('You don\'t notice anything.');
    const description = await unit.describer.describe('items', items);
    const message = await unit.describe('info', `You notice: ${description}`);
    unit.emit('message', message);
    unit.broadcastToRoom(unit.room, 'message', { type: 'info', value: `${unit.name} is searching the room intently.` });
  }),
);
