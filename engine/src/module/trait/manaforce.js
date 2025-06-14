const { Action, Force } = require('@coderich/gameflow');

Action.define('manaforce', new Force([
  () => APP.timeout(10000),

  async (_, { actor }) => {
    const { ma } = await actor.mGet('ma');
    const incr = Math.min(actor.mma - ma, 2);
    if (incr > 0) actor.perform('affect', { ma: incr });
  },
]));
