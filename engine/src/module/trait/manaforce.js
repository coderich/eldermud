const { Action, Force } = require('@coderich/gameflow');

Action.define('manaforce', new Force([
  () => APP.timeout(10000),

  async (_, { actor }) => {
    const { ma, wis } = await actor.mGet('ma', 'wis');
    const tick = Math.max(Math.floor(wis / 10), 1);
    const incr = Math.min(actor.mma - ma, tick);
    if (incr > 0) actor.perform('affect', { ma: incr });
  },
]));
