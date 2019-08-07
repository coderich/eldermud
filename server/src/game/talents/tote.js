import { mergeMap } from 'rxjs/operators';
import { getData } from '../../service/data.service';
import { createAction } from '../../service/stream.service';
import { instaAttack, isValidTarget } from '../../service/game.service';

const cost = 20;

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
        dmg: '1d2',
        acc: 20,
        hits: ['pound'],
        pre: (source, t, attack, others) => {
          others.forEach((other) => {
            if (isValidTarget(source, other)) {
              other.stun();
            }
          });
        },
      });
    });
  }),
);
