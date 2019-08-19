import Chance from 'chance';

const chance = new Chance();

export const numToArray = num => Array.from(Array(num));

export const titleCase = name => name.charAt(0).toUpperCase() + name.slice(1);

export const randomElement = arr => arr[Math.floor(Math.random() * arr.length)];

export const timeout = ms => new Promise(res => setTimeout(res, ms));

export const roll = (dice) => {
  if (typeof dice !== 'string') return dice;

  const input = dice.match(/\S+/g).join('');
  const [, rolls, sides, op = '+', mod = 0] = input.match(/(\d+)d(\d+)([+|-|\\*|\\/]?)(\d*)/);

  const value = numToArray(Number.parseInt(rolls, 10)).reduce((prev, curr) => {
    return prev + chance.integer({ min: 1, max: sides });
  }, 0);

  return eval(`${value} ${op} ${mod}`); // eslint-disable-line
};

export const getCoords = (row, col, dir) => {
  switch (dir) {
    case 'n': { row--; break; }
    case 's': { row++; break; }
    case 'e': { col++; break; }
    case 'w': { col--; break; }
    case 'ne': { row--; col++; break; }
    case 'nw': { row--; col--; break; }
    case 'se': { row++; col++; break; }
    case 'sw': { row++; col--; break; }
    default: break;
  }
  return { row, col };
};

export const directions = {
  n: 'north',
  s: 'south',
  e: 'east',
  w: 'west',
  ne: 'northeast',
  nw: 'northwest',
  se: 'southeast',
  sw: 'southwest',
  u: 'up',
  d: 'down',
};

export const rdirections = {
  n: 'south',
  s: 'north',
  e: 'west',
  w: 'east',
  ne: 'southwest',
  nw: 'southeast',
  se: 'northwest',
  sw: 'northeast',
  u: 'down',
  d: 'up',
};

export const tnl = level => Math.floor(100 * (level ** (1.3 + (level / 10))));
// export const tnl = level => 100 * (level ** 2) - (100 * level); // D&D

export const svl = (level) => {
  let value = 0;

  for (let i = 1; i <= level; i++) {
    const mul = Math.floor(i / 5) + 3;
    value += mul * i;
  }

  return value;
};

export const rgen = level => Math.floor(level / 5) + 1;
