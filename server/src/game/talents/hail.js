import { attack } from '../actions';

export default async (id, command) => {
  return attack(id, '', {
    cost: 20,
    dmg: '2d5+3',
    acc: '3d5+5',
    hits: ['pummel'],
    misses: ['reach'],
    scope: 'room',
  });
};
