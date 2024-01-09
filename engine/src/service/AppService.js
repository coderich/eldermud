const Chance = require('chance');
const Util = require('@coderich/util');
const Pluralize = require('pluralize');
const NPC = require('../model/NPC');
const Item = require('../model/Item');
const Creature = require('../model/Creature');

const chance = new Chance();
const models = { npc: NPC, item: Item, creature: Creature };

exports.chance = chance;
exports.pluralize = Pluralize;
exports.timeout = Util.timeout;
exports.direction = { n: 'north', s: 'south', e: 'east', w: 'west', ne: 'northeast', nw: 'northwest', se: 'southeast', sw: 'southwest', u: 'up', d: 'down' };
exports.rdirection = { n: 'south', s: 'north', e: 'west', w: 'east', ne: 'southwest', nw: 'southeast', se: 'northwest', sw: 'northeast', u: 'down', d: 'up' };
exports.randomElement = arr => arr[Math.floor(Math.random() * arr.length)];
exports.styleText = (style, ...text) => `${CONFIG.get(`app.styles.${style}`)}${text.flat().join(' ')}${CONFIG.get('app.styles.reset')}`;
exports.isNumeric = str => !Number.isNaN(Number(str));

exports.styleBlockText = (styles = [], blocktext) => {
  return styles.reduce((prev, { text, style, limit = Infinity }) => {
    const re = new RegExp(`\\b${text}(?=$|\\W)`, 'g');
    return prev.replace(re, (match) => {
      return limit-- > 0 ? exports.styleText(style, text) : match;
    });
  }, blocktext);
};

exports.target = (list, args, by = 'name') => {
  const arr = list instanceof Set ? Array.from(list.values()) : list; // Ensure array
  const $args = [...args]; // Shallow copy
  const fn = typeof by === 'function' ? by : ((el, text) => el[by].toLowerCase().split(' ').some(tok => tok.startsWith(text)));
  const result = { rest: [] };

  args.forEach(() => {
    result.target = arr.find(el => fn(el, $args.join(' ')));
    if (result.target) return; // break
    result.rest.unshift($args.pop());
  });

  return result;
};

/**
 * Given a provided set of configuration keys; will instantiate a new config instance
 */
exports.instantiate = (keys, data = {}) => {
  return Util.mapPromise(keys, (key) => {
    return Promise.all([CONFIG.get(`${key}`), REDIS.incr(`counter.${key}`)]).then(([config, counter]) => {
      return new models[config.type]({ ...config, toString: () => `${key}.${counter}`, ...data });
    });
  });
};

/**
 * Given a set of configuration keys; will return a configuration object
 */
exports.hydrate = (keys) => {
  return Util.map(keys, (key) => {
    const arr = `${key}`.split('.');
    const toString = () => `${key}`;
    const $key = exports.isNumeric(arr.pop()) ? arr.join('.') : key;
    return { ...CONFIG.get(`${$key}`), toString };
  });
};

exports.roll = (dice) => {
  if (typeof dice !== 'string') return dice;

  const input = dice.match(/\S+/g).join('');
  const [, rolls, sides, op = '+', mod = 0] = input.match(/(\d+)d(\d+)([+-\\*\\/]?)(\d*)/);

  // Dice roll value
  const value = Array.from(Array(Number.parseInt(rolls, 10))).reduce((prev, curr) => {
    return prev + chance.integer({ min: 1, max: sides });
  }, 0);

  // Modifier value (need to parse possible string to integer)
  const val = parseInt(mod, 10);

  switch (op) {
    case '+': return value + val;
    case '-': return value - val;
    case '*': return value * val;
    case '/': return value / val;
    case '%': return value % val;
    case '**': return value ** val; // Power of
    default: return value;
  }
};

exports.table = (rows, options = {}) => {
  let table = '', startIndex = 0;
  const sep = options.sep ?? '| ';

  // Determine the maximum width for each column
  const colWidths = rows[0].map((_, i) => Math.max(...rows.map(row => String(row[i]).length)));

  // Generate header
  if (options.header) {
    startIndex = 1;
    const headers = rows[0];
    table = table.concat(headers.reduce((prev, header, i) => {
      return prev.concat(`${header.toString().padEnd(colWidths[i])} | `);
    }, '| '), '\n').concat('|', headers.map((_, i) => `${'-'.repeat(colWidths[i] + 2)}|`).join(''), '\n');
  }

  // Generate data
  table = table.concat(rows.slice(startIndex).reduce((prev, row) => {
    return prev.concat(sep, row.map((data, i) => `${data.toString().padEnd(colWidths[i])} ${sep}`).join(''), '\n');
  }, ''));

  return table.trimEnd('\n');
};