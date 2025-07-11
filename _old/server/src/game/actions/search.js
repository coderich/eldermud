import { mergeMap } from 'rxjs/operators';
import { getData } from '../../service/data.service';
import { createAction } from '../../service/stream.service';
import { breakAttack } from '../../service/game.service';

export default id => createAction(
  mergeMap(async () => {
    const unit = await getData(id);
    await breakAttack(unit.id);
    unit.broadcastToRoom(unit.room, 'message', { type: 'info', value: `${unit.name} is searching the room.` });
    const room = await unit.Room();
    const items = await room.search();
    if (!items.length) unit.breakAction('Your search revealed nothing.');
    const description = await unit.describer.describe('items', items);
    const message = await unit.describe('info', `You notice: ${description}`);
    unit.emit('message', message);
  }),
);
