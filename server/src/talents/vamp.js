import { attack } from '../actions';
import { emit } from '../service/socket.service';

export default async (id, command) => {
  const input = command.args.join(' ');

  return attack(id, input, {
    cost: 20,
    dmg: '2d5+3',
    acc: '3d5+5',
    proc: (source, target, damage) => {
      source.hp = Math.max(source.mhp, source.hp + damage);
      emit(id, 'message', { type: 'info', value: `You drain ${damage} life points.` });
    },
  });
};
