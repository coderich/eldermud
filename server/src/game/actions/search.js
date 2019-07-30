import { mergeMap } from 'rxjs/operators';
import { getData } from '../../service/data.service';
import { createAction } from '../../service/stream.service';
import { getAttack } from '../../service/game.service';

export default async id => createAction(
  mergeMap(async () => {
    const unit = await getData(id);

    if (getAttack(id)) unit.breakAction('You may not search while attacking!');

    unit.broadcastToRoom(unit.room, 'message', { type: 'info', value: `${unit.name} is searching the room.` });

    const room = await unit.Room();
    const items = await room.search();
    if (!items.length) unit.breakAction('Your search revealed nothing.');
    const description = await unit.describer.describe('items', items);
    const message = await unit.describe('info', `You notice: ${description}`);
    unit.emit('message', message);
  }),
);
