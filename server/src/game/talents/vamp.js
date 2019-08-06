import { attack } from '../actions';
import { emit } from '../../service/socket.service';

export default async (id, command) => {
  const input = command.args.join(' ');

  return attack(id, input, {
    cost: 20,
    dmg: '2d5+3',
    acc: '3d5+5',
    hits: ['drain'],
    misses: ['reach'],
    proc: (source, target, damage) => {
      source.hp = Math.min(source.mhp, source.hp + damage);
      emit(id, 'message', { type: 'info', value: `You gain ${damage} life points.` });
    },
  });
};
