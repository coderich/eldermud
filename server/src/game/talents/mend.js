import { mergeMap } from 'rxjs/operators';
import { getData, setData, incData } from '../../service/data.service';
import { createAction } from '../../service/stream.service';


export default async (id, command) => createAction(
  mergeMap(async () => {
    const unit = await getData(id);
    const talent = await getData('talent.mend');
    if (talent.req.ma > unit.ma) unit.breakAction('Insufficient mana.');

    return unit.perform(async () => {
      await incData(id, 'ma', -talent.req.ma);
      const roll = unit.roll('1d6+2');
      const hp = Math.min(unit.mhp, unit.hp + roll);
      await setData(id, 'hp', hp);
      unit.emit('message', { type: 'water', value: `You cast ${talent.name}, recovering ${roll} health!` });
      unit.status();
    });
  }),
);
