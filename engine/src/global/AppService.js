const Util = require('@coderich/util');

exports.styleText = (text, style) => {
  return `${CONFIG.get(`styles.${style}`)}${text}${CONFIG.get('styles.reset')}`;
};

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

exports.instantiate = (keys) => {
  return Util.mapPromise(keys, (key) => {
    return Promise.all([CONFIG.get(key), REDIS.incr(`counter.${key}`)]).then(([data, counter]) => {
      return { ...data, toString: () => `${key}.${counter}` };
    });
  });
};

exports.direction = {
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

exports.rdirection = {
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
