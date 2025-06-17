const { Action } = require('@coderich/gameflow');

/**
 * Harvest the corpse for remnants
 */
Action.define('harvest', [
  async ({ target }, { actor, abort }) => {
    if (!target) return abort('You dont see that here!');
    const stats = await target.mGet('name', 'mhp', 'lvl', 'durability');
    const remnants = stats.mhp * stats.lvl;
    const exp = Math.floor((remnants / 10) * stats.durability);
    actor.perform('affect', { exp });
    return actor.send('text', `You harvest ${APP.styleText('keyword', exp)} remnants from ${stats.name}.`);
  },
]);
