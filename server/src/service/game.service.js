import Chance from 'chance';
import * as dao from '../store';

export const chance = new Chance();

export const roll = (dice) => {
  if (typeof dice !== 'string') return dice;

  const input = dice.match(/\S+/g).join('');
  const [, rolls, sides, op = '+', mod = 0] = input.match(/(\d+)d(\d+)([+|-|\\*|\\/]?)(\d*)/);

  const value = Array.from(Array(Number.parseInt(rolls, 10))).reduce((prev, curr) => {
    return prev + this.chance.integer({ min: 1, max: sides });
  }, 0);

  return eval(`${value} ${op} ${mod}`); // eslint-disable-line
};

export const makeCreature = async (templateData, initialData) => {
  const now = new Date().getTime();
  const id = `creature.${now}`;
  const hp = roll(templateData.hp);
  const exp = templateData.exp * hp;
  const template = templateData.id;
  const creature = Object.assign({}, templateData, { id, hp, exp, template }, initialData);
  return dao.get(id, creature);
};
