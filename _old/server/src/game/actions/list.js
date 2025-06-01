import { mergeMap } from 'rxjs/operators';
import { getData } from '../../service/data.service';
import { createAction } from '../../service/stream.service';

export default id => createAction(
  mergeMap(async () => {
    const unit = await getData(id);
    const room = await unit.Room();
    const shop = await room.Shop() || unit.abortAction('There is no shop here!');
    const items = await Promise.all(shop.items.map(item => getData(item)));
    const value = items.map(item => ({ name: item.name, cost: item.cost }));
    unit.emit('message', { type: 'shop', value });
  }),
);
