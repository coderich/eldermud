import { mergeMap } from 'rxjs/operators';
import { getData } from '../../service/data.service';
import { createAction } from '../../service/stream.service';
import { instaAttack } from '../../service/game.service';

const cost = 0;

export default async (id, command) => createAction(
  mergeMap(async () => {
    const input = command.args.join(' ');
    const unit = await getData(id);
    const room = await unit.Room();
    const target = await room.resolveTarget('units', input, { omit: [unit.id] });
    if (cost > unit.exp) unit.breakAction('Insufficient power.');
    if (!target) unit.breakAction('You don\'t see that here!');

    return unit.perform(async () => {
      instaAttack(id, target.id, {
        cost,
        dmg: '2d10+10',
        acc: 20,
        proc: (source, t, damage) => {
          source.hp = Math.max(1, source.hp - damage);
        },
      });
    });
  }),
);
