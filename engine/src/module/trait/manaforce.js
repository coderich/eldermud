const { Action, Force } = require('@coderich/gameflow');

Action.define('manaforce', new Force([
  () => APP.timeout(10000),

  async (_, { actor }) => {
    const { ma, mma, wis } = await actor.mGet('ma', 'mma', 'wis');
    const tick = Math.max(Math.floor(wis / 10), 1);
    const incr = Math.min(mma - ma, tick);
    if (incr > 0) actor.perform('affect', { ma: incr });
  },
]));
