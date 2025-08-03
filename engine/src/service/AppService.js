const Chance = require('chance');
const Util = require('@coderich/util');
const Pluralize = require('pluralize');
const NPC = require('../model/NPC');
const Item = require('../model/Item');
const Room = require('../model/Room');
const Actor = require('../model/Actor');
const Talent = require('../model/Talent');
const Player = require('../model/Player');
const Creature = require('../model/Creature');

const chance = new Chance();

const models = {
  npc: NPC,
  player: Player,
  item: Item,
  creature: Creature,
  key: Item,
  room: Room,
  talent: Talent,
};

exports.chance = chance;
exports.pluralize = Pluralize;
exports.timeout = Util.timeout;
exports.ucFirst = Util.ucFirst;
exports.mapPromise = Util.mapPromise;
exports.promiseChain = Util.promiseChain;
exports.fib = [1, 3, 5, 8, 13, 21, 34, 55, 89];
exports.direction = { n: 'north', s: 'south', e: 'east', w: 'west', ne: 'northeast', nw: 'northwest', se: 'southeast', sw: 'southwest', u: 'up', d: 'down' };
exports.rdirection = { n: 'south', s: 'north', e: 'west', w: 'east', ne: 'southwest', nw: 'southeast', se: 'northwest', sw: 'northeast', u: 'down', d: 'up' };
exports.theDirection = Object.entries(exports.direction).reduce((prev, [k, v]) => ({ [k]: `the ${v}`, ...prev }), { u: 'above', d: 'below' });
exports.theRDirection = Object.entries(exports.rdirection).reduce((prev, [k, v]) => ({ [k]: `the ${v}`, ...prev }), { d: 'above', u: 'below' });
exports.randomElement = arr => arr[Math.floor(Math.random() * arr.length)];
exports.styleText = (style, ...text) => `${CONFIG.get(`app.styles.${style}`)}${text.flat().join(' ')}${CONFIG.get('app.styles.reset')}`;
exports.isNumeric = str => !Number.isNaN(Number(`${str}`));
exports.isBoolean = str => ['true', 'false'].includes(`${str}`.toLowerCase());
exports.fibStat = (val, every = 10) => Array.from(new Array(parseInt(val ?? 0, 10))).reduce((prev, el, i) => prev + exports.fib[Math.floor(i / every)], 0);
exports.tnl = lvl => lvl * 100 * exports.fibStat(lvl, 2);

exports.castValue = (value) => {
  if (value == null) return value;
  if (value instanceof Actor) return `${value}`;
  if (typeof value === 'object') return value.__proto === 'action' ? `${value}` : value;
  if (APP.isNumeric(value)) return parseInt(value, 10);
  if (APP.isBoolean(value)) return Boolean(`${value}`.toLowerCase() === 'true');
  return value;
};

exports.styleBlockText = (base, styles = [], blocktext) => {
  return styles.reduce((prev, { text, style, limit = Infinity }) => {
    const escapedText = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // const re = new RegExp(`\\b${text}(?=$|\\W)`, 'g');
    const re = new RegExp(`(?<=^|\\W)${escapedText}(?=$|\\W)`, 'g');
    return prev.replace(re, (match) => {
      return limit-- > 0 ? exports.styleText(style, text).concat(CONFIG.get(`app.styles.${base}`)) : match;
    });
  }, APP.styleText(base, blocktext));
};

exports.target = (list, args, by = 'name') => {
  const result = { rest: [] };
  const arr = list instanceof Set ? Array.from(list.values()) : list; // Ensure array
  const $args = [...args].map(el => el.toLowerCase()); // Shallow copy

  // Sort the array by length of what you're searching by to improve accuracy
  arr.sort((a, b) => {
    const alen = a[by]?.length || 0;
    const blen = b[by]?.length || 0;
    return alen - blen;
  });

  // The find function
  const fn = (subject, words) => {
    const $labels = subject[by].toLowerCase().split(' ');
    return words.every((w, i) => $labels[i].startsWith(w));
  };

  // Traverse to find target and the rest of the saying
  args.forEach(() => {
    result.target = arr.find(el => fn(el, $args));
    if (result.target) return; // break
    result.rest.unshift($args.pop());
  });

  return result;
};

exports.uniqIdKeys = (...keys) => {
  return Array.from(new Set(keys.flat().map((key) => {
    const arr = key.split('.');
    const index = arr.findIndex(el => APP.isNumeric(el));
    return arr.slice(0, index + 1).join('.');
  })).values()).filter(Boolean);
};

/**
 * Given a set of configuration keys; will instantiate a new model and save to disk
 */
exports.instantiate = (keys, data = {}) => {
  return exports.mapPromise(keys, (key) => {
    return Promise.all([CONFIG.get(`${key}`), REDIS.incr(`counter.${key}`)]).then(([config, counter]) => {
      const attrs = { ...config, toString: () => `${key}.${counter}`, ...data };
      return new models[config.type](attrs).save(attrs);
    });
  });
};

/**
 * Given a set of configuration keys; will return a hydrated model
 */
exports.hydrate = (keys, asData = false) => {
  return exports.mapPromise(keys, async (key) => {
    const arr = `${key}`.split('.');
    const configKey = exports.isNumeric(arr.pop()) ? arr.join('.') : key;
    const configData = CONFIG.get(`${configKey}`);
    const redisKeys = await REDIS.keys(`${key}.*`);
    const redisData = redisKeys.length ? await REDIS.mGet(redisKeys).then(values => values.reduce((prev, value, i) => Object.assign(prev, { [redisKeys[i].split('.').pop()]: APP.castValue(value) }), {})) : {};
    const data = { ...configData, ...redisData, toString: () => `${key}` };
    return asData ? data : new models[configData.type](data);
  });
};

exports.roll = (dice) => {
  if (exports.isNumeric(dice)) return Number(dice);

  const input = dice.match(/\S+/g).join('');
  const [, neg, rolls, sides, op = '+', mod = 0] = input.match(/(-?)(\d+)d(\d+)(\*\*|[%+\-*\\/]?)(\d*)/);
  // const [, neg, rolls, sides, op = '+', mod = 0] = input.match(/(-?)(\d+)d(\d+)([+-\\*\\/]?)(\d*)/);
  if (Number.parseInt(sides, 10) <= 0) return 0;

  // Dice roll value
  let value = Array.from(Array(Number.parseInt(rolls, 10))).reduce((prev, curr) => {
    return prev + chance.integer({ min: 1, max: sides });
  }, 0);

  // Modifier value (need to parse possible string to integer)
  const val = parseInt(mod, 10);

  switch (op) {
    case '+': { value += val; break; }
    case '-': { value -= val; break; }
    case '*': { value *= val; break; }
    case '/': { value /= val; break; }
    case '%': { value %= val; break; }
    case '**': { value **= val; break; } // Power of
    default: break;
  }

  return neg ? -value : value;
};

// exports.stripColorTags = str => str.replace(/<[^>]+>(.*?)<reset>/g, '$1');
exports.stripColorTags = str => str.replace(/<[^>]+>/g, '');

exports.table = (rows, options = {}) => {
  rows = rows.filter(Boolean);
  let table = '', startIndex = 0;
  const sep = options.sep ?? '| ';

  // Determine the maximum width for each column
  const colWidths = rows[0].map((_, i) => Math.max(...rows.map(row => exports.stripColorTags(String(row[i])).length)));

  // Generate header
  if (options.header) {
    startIndex = 1;
    const headers = rows[0];
    table = table.concat(headers.reduce((prev, header, i, arr) => {
      header = header.toString();
      const extra = header.length - exports.stripColorTags(header).length;
      return prev.concat(`${header.padEnd(colWidths[i] + extra)} | `);
    }, '| '), '\n').concat('|', headers.map((_, i) => `${'-'.repeat(colWidths[i] + 2)}|`).join(''), '\n');
  }

  // Generate data
  table = table.concat(rows.slice(startIndex).reduce((prev, row) => {
    return prev.concat(sep, row.map((data, i, arr) => {
      data = data.toString();
      const extra = data.length - exports.stripColorTags(data).length;
      const value = `${data.padEnd(colWidths[i] + extra)} ${sep}`;
      // const value = i <= arr.length - 2 ? `${data.padEnd(colWidths[i] + extra)} ${sep}` : `${data} ${sep}`;
      return value;
    }).join(''), '\n');
  }, ''));

  return table.trimEnd('\n');
};

exports.to2DParty = (party) => {
  const arr = [
    party.filter(unit => unit.$partyRank === 1).map(unit => APP.styleText(unit.type, unit.name)).join(', '),
    party.filter(unit => unit.$partyRank === 2).map(unit => APP.styleText(unit.type, unit.name)).join(', '),
    party.filter(unit => unit.$partyRank === 3).map(unit => APP.styleText(unit.type, unit.name)).join(', '),
  ].filter(Boolean).join(' > ');
  return `[${arr}]`;
};

exports.targetHelp = (args) => {
  const $config = CONFIG.toObject();
  const things = Object.values($config.data).map(el => Object.values(el)).flat().filter(Boolean);
  return APP.target(things, args);
};
