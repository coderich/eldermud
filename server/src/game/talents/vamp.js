import { attack as doAttack } from '../actions';
import { emit } from '../../service/socket.service';

export default async (id, command) => {
  const input = command.args.join(' ');

  return doAttack(id, input, {
    cost: 20,
    dmg: '2d5+3',
    acc: '3d5+5',
    hits: ['sap'],
    misses: ['reach'],
    // describer: (source, target, attack, damage) => {

    // },
    proc: (source, target, attack, damage) => {
      source.hp = Math.min(source.mhp, source.hp + damage);
      emit(id, 'message', { type: 'water', value: `You gain ${damage} life points.` });
    },
  });
};
