import { mergeMap } from 'rxjs/operators';
import { getData } from '../../service/data.service';
import { createAction } from '../../service/stream.service';
import { instaAttack, isValidTarget } from '../../service/game.service';
import { toRoom } from '../../service/socket.service';


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
        dmg: '2d5*2',
        acc: 20,
        hits: ['pound'],
        pre: async (source, t, attack, others) => {
          await toRoom(room, 'message', { type: 'water', value: `${unit.name} slams the ground beneath them!` });

          others.forEach((other) => {
            if (isValidTarget(source, other)) {
              other.stun(3500);
            }
          });
        },
      });
    });
  }),
);
