import { attack as doAttack } from '../actions';

export default async (id, command) => {
  return doAttack(id, '', {
    cost: 20,
    dmg: '2d5+3',
    acc: 20,
    hits: ['pummel'],
    misses: ['reach'],
    scope: 'room',
    describer: async (source, target, attack, others, damage) => {
      source.emit('message', { type: 'error', value: `You reign down hailstorm on the room for ${damage} damage!` });
    },
  });
};
