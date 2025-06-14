const { Action, Force } = require('@coderich/gameflow');

Action.define('lifeforce', new Force([
  () => APP.timeout(10000),

  async (_, { actor }) => {
    const { hp } = await actor.mGet('hp');
    const incr = Math.min(actor.mhp - hp, 2);
    if (incr > 0) actor.perform('affect', { hp: incr });
  },
]));
