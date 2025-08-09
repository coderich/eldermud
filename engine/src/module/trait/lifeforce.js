const { Action, Force } = require('@coderich/gameflow');

Action.define('lifeforce', new Force([
  (_, { actor }) => APP.timeout(actor.lifeforce),

  async (_, { actor }) => {
    const { hp, mhp, con } = await actor.mGet('hp', 'mhp', 'con');
    const tick = Math.max(Math.floor(con / 10), 1);
    const incr = Math.min(mhp - hp, tick);
    if (incr > 0) actor.perform('affect', { hp: incr });
  },
]));
