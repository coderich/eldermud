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

export const titleCase = name => name.charAt(0).toUpperCase() + name.slice(1);

export const numToArray = num => Array.from(Array(num));

export const randomElement = arr => arr[Math.floor(Math.random() * arr.length)];
