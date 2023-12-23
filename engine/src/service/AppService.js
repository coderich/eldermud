const Chance = require('chance');
const Util = require('@coderich/util');

const chance = new Chance();

exports.direction = { n: 'north', s: 'south', e: 'east', w: 'west', ne: 'northeast', nw: 'northwest', se: 'southeast', sw: 'southwest', u: 'up', d: 'down' };
exports.rdirection = { n: 'south', s: 'north', e: 'west', w: 'east', ne: 'southwest', nw: 'southeast', se: 'northwest', sw: 'northeast', u: 'down', d: 'up' };

exports.randomElement = arr => arr[Math.floor(Math.random() * arr.length)];

exports.styleText = (text, style) => `${CONFIG.get(`styles.${style}`)}${text}${CONFIG.get('styles.reset')}`;

exports.styleBlockText = (blocktext, styles = []) => {
  return styles.reduce((prev, { text, style, limit = Infinity }) => {
    const re = new RegExp(`\\b${text}(?=$|\\W)`, 'g');
    return prev.replace(re, (match) => {
      return limit-- > 0 ? exports.styleText(text, style) : match;
    });
  }, blocktext);
};

exports.target = (list, args, by = 'name') => {
  const arr = list instanceof Set ? Array.from(list.values()) : list; // Ensure array
  const $args = [...args]; // Shallow copy
  const fn = typeof by === 'function' ? by : ((el, text) => el[by].toLowerCase().indexOf(text) === 0);
  const result = { rest: [] };

  args.forEach(() => {
    result.target = arr.find(el => fn(el, $args.join(' ')));
    if (result.target) return;
    result.rest.unshift($args.pop());
  });

  return result;
};

exports.instantiate = (...keys) => {
  return Util.mapPromise(keys.flat(), (key) => {
    return Promise.all([CONFIG.get(`${key}`), REDIS.incr(`counter.${key}`)]).then(([data, counter]) => {
      return { ...data, toString: () => `${key}.${counter}` };
    });
  });
};

exports.roll = (dice) => {
  if (typeof dice !== 'string') return dice;

  const input = dice.match(/\S+/g).join('');
  const [, rolls, sides, op = '+', mod = 0] = input.match(/(\d+)d(\d+)([+|-|\\*|\\/]?)(\d*)/);

  const value = Array.from(Array(Number.parseInt(rolls, 10))).reduce((prev, curr) => {
    return prev + chance.integer({ min: 1, max: sides });
  }, 0);

  return eval(`${value} ${op} ${mod}`); // eslint-disable-line
};

exports.table = (rows, options = {}) => {
  let table = '', startIndex = 0;

  // Determine the maximum width for each column
  const colWidths = rows[0].map((_, i) => Math.max(...rows.map(row => String(row[i]).length)));

  // Generate header
  if (options.header) {
    startIndex = 1;
    const headers = rows[0];
    table = table.concat(headers.reduce((prev, header, i) => {
      return prev.concat(`${header.padEnd(colWidths[i])} | `);
    }, '| '), '\n').concat('|', headers.map((_, i) => `${'-'.repeat(colWidths[i] + 2)}|`).join(''), '\n');
  }

  // Generate data
  table = table.concat(rows.slice(startIndex).reduce((prev, row) => {
    return prev.concat('| ', row.map((data, i) => `${data.padEnd(colWidths[i])} | `).join(''), '\n');
  }, ''));

  return table.trimEnd('\n');
};
