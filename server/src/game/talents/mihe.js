import { mergeMap } from 'rxjs/operators';
import { getData, setData, incData } from '../../service/data.service';
import { createAction } from '../../service/stream.service';

const cost = 10;
const name = 'minor healing';

export default async (id, command) => createAction(
  mergeMap(async () => {
    const unit = await getData(id);
    if (cost > unit.ma) unit.breakAction('Insufficient mana.');

    return unit.perform(async () => {
      await incData(id, 'ma', -cost);
      const roll = unit.roll('3d3+3');
      const hp = Math.min(unit.mhp, unit.hp + roll);
      setData(id, 'hp', hp);
      unit.emit('message', { type: 'water', value: `You cast ${name}, recovering ${roll} health!` });
      unit.status();
    });
  }),
);