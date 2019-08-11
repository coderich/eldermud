import { mergeMap } from 'rxjs/operators';
import { getData } from '../../service/data.service';
import { createAction } from '../../service/stream.service';
import { instaAttack } from '../../service/game.service';

const cost = 0;
const set = new Set();

export default async (id, command) => createAction(
  mergeMap(async () => {
    const input = command.args.join(' ');
    const unit = await getData(id);
    const room = await unit.Room();
    const target = await room.resolveTarget('units', input, { omit: [unit.id] });
    if (set.has(id)) unit.breakAction('Must wait for cooldown');
    if (cost > unit.exp) unit.breakAction('Insufficient mana.');
    if (!target) unit.breakAction('You don\'t see that here!');

    return unit.perform(async () => {
      set.add(id);

      await instaAttack(id, target.id, {
        cost,
        dmg: '2d10+10',
        acc: 20,
        hits: ['double edge'],
        post: (source, t, attack, others, damage) => {
          if (damage) {
            const recoil = Math.round(damage / 2);
            source.hp = Math.max(1, source.hp - recoil);
          }
        },
      });

      setTimeout(() => {
        set.delete(id);
      }, 15000);
    });
  }),
);
