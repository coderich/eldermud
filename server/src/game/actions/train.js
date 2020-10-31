import { mergeMap } from 'rxjs/operators';
import { getData, setData, incData } from '../../service/data.service';
import { createAction } from '../../service/stream.service';
import { tnl, svl } from '../../service/util.service';

const stats = ['strength', 'agility', 'intellect'];

export default async (id, target) => createAction(
  mergeMap(async () => {
    const unit = await getData(id);
    const room = await unit.Room();
    const needed = tnl(unit.lvl);
    const stat = stats.find(st => st.indexOf(target) === 0);
    if (!await room.Trainer()) unit.abortAction('There is no trainer here!');
    if (!stat) unit.abortAction('Train what? (STR|AGI|INT)');
    if (unit.exp < needed) unit.breakAction('You have insufficient focus.');

    const promises = [incData(unit.id, 'lvl', 1), incData(unit.id, 'exp', -needed)];

    switch (stat) {
      case 'strength': {
        unit.str++;
        promises.push(setData(unit.id, 'str', unit.str));
        promises.push(setData(unit.id, 'hp', svl(unit.str)));
        promises.push(setData(unit.id, 'mhp', svl(unit.str)));
        break;
      }
      case 'agility': {
        unit.agi++;
        promises.push(setData(unit.id, 'agi', unit.agi));
        break;
      }
      case 'intellect': {
        unit.int++;
        promises.push(setData(unit.id, 'int', unit.int));
        promises.push(setData(unit.id, 'ma', svl(unit.int)));
        promises.push(setData(unit.id, 'mma', svl(unit.int)));
        break;
      }
      default: break;
    }

    await Promise.all(promises);
    unit.stats();
    unit.status();
    unit.emit('message', { type: 'info', value: `You level up your ${stat}!` });
  }),
);
