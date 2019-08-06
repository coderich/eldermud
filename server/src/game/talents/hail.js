import { attack } from '../actions';

export default async (id, command) => {
  return attack(id, '', {
    cost: 20,
    dmg: '2d5+3',
    acc: '3d5+5',
    hits: ['pummel'],
    misses: ['reach'],
    scope: 'room',
    // proc: (source, target, damage) => {
    //   source.hp = Math.min(source.mhp, source.hp + damage);
    //   emit(id, 'message', { type: 'info', value: `You gain ${damage} life points.` });
    // },
  });
};
