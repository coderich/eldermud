import { attack as doAttack } from '../actions';

export default async (id, command) => {
  return doAttack(id, '', {
    cost: 20,
    dmg: '2d5+3',
    acc: '3d5+5',
    hits: ['pummel'],
    misses: ['reach'],
    scope: 'room',
    // describer: async (source, target, attack, others, damage) => {

    // },
  });
};
