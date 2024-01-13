const { Action } = require('@coderich/gameflow');

Action.define('swing', [
  // Roll to hit
  async ({ attack, target, mods = {} }, { actor, abort }) => {
    // Normalize dynamic mods
    mods = { ac: 0, dr: 0, acc: 0, dmg: 0, crit: 0, dodge: 0, ...mods };
    attack = { acc: 0, crit: 0, ...attack };

    // // Query for stats
    // const [attacker, defender] = await Promise.all([actor.mGet(['acc', 'crit']), target.mGet(['ac', 'dr', 'dodge'])]).then((results) => {
    //   return results.map(result => Object.entries(result).reduce((prev, [key, value]) => Object.assign(prev, { [key]: parseInt(value, 10) }), {}));
    // });

    // Roll
    const toHit = 30;
    const roll = APP.roll('1d100');
    const hitroll = (roll + actor.acc + mods.acc - target.ac - mods.ac);
    if (hitroll <= toHit) return actor.perform('miss', { attack, target }) && abort();
    if (hitroll - mods.dodge <= toHit) return actor.perform('miss', { attack, target, dodge: true }) && abort();
    return { attack, target, mods, roll };
  },

  // Roll for dmg
  (data, { actor }) => {
    const { roll, attack, mods } = data;
    data.crit = roll + mods.crit > 95;
    data.dmg = APP.roll(attack.dmg) + mods.dmg - data.target.dr - mods.dr;
    if (data.crit) data.dmg = Math.ceil(data.dmg * 1.5);
    return data;
  },

  // Hit
  (data, { actor }) => {
    return actor.perform('hit', data);
  },
]);
