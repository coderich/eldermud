import { mergeMap } from 'rxjs/operators';
import { getData } from '../../service/data.service';
import { createAction } from '../../service/stream.service';

export default id => createAction(
  mergeMap(async () => {
    const unit = await getData(id);
    const items = await unit.Items();
    const description = items.length === 0 ? 'nothing!' : items.map(item => item.name).join(', ');
    const message = await unit.describe('info', `You are carrying: ${description}`);
    unit.emit('message', message);
  }),
);
