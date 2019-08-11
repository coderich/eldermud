import { mergeMap } from 'rxjs/operators';
import { getData, pushData, pullData } from '../../service/data.service';
import { breakAttack } from '../../service/game.service';
import { createAction } from '../../service/stream.service';

export default async (id, target) => createAction(
  mergeMap(async () => {
    const unit = await getData(id);
    const item = await unit.resolveTarget('items', target) || unit.abortAction('You don\'t have that on you!');
    const equipped = await unit.Equipped();
    if (equipped.find(eq => eq.id === item.id)) unit.abortAction('Already equipped!');

    switch (item.type) {
      case 'weapon': {
        const weapon = equipped.find(it => it.type === 'weapon');
        if (weapon) await pullData(id, 'equipped', weapon.id);
        break;
      }
      case 'armor': {
        const armor = equipped.find(it => it.type === 'armor' && it.location === item.location);
        if (armor) await pullData(id, 'equipped', armor.id);
        break;
      }
      default: {
        unit.abortAction('That cannot be equipped!');
        break;
      }
    }

    await Promise.all([
      breakAttack(unit.id),
      pushData(id, 'equipped', item.id),
    ]);

    unit.emit('message', await unit.describe('info', `You equip ${item.name}.`));
    unit.stats();
  }),
);
