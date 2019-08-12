import { mergeMap } from 'rxjs/operators';
import { getData, setData } from '../../service/data.service';
import { createAction } from '../../service/stream.service';
import { instaAttack } from '../../service/game.service';

export default async (id, command) => createAction(
  mergeMap(async () => {
    const input = command.args.join(' ');
    const unit = await getData(id);
    const room = await unit.Room();
    const target = await room.resolveTarget('units', input, { omit: [unit.id] });
    const talent = await getData('talent.stab');

    if (unit.cooldowns.stab) unit.breakAction('Must wait for cooldown.');
    if (talent.req.ma > unit.ma) unit.breakAction('Insufficient mana.');
    if (!target) unit.breakAction('You don\'t see that here!');

    return unit.perform(async () => {
      await setData(id, 'cooldowns.stab', 10);

      await instaAttack(id, target.id, {
        cost: talent.req.ma,
        dmg: '1d6+1',
        acc: 20,
        hits: ['surprise stab'],
      });
    });
  }),
);
