const { Action } = require('@coderich/gameflow');

/**
 */
Action.define('mend', [
  ({ target }, { abort, actor }) => {
    return target ?? actor;
  },

  async (target, { actor, stream }) => {
    const mend = CONFIG.get('talent.mend');
    const heal = APP.roll(mend.heal);
    const { hp } = await actor.mGet('hp');
    const incr = Math.min(actor.mhp - hp, heal);
    const name = target === actor ? 'yourself' : target.name;
    actor.send('text', APP.styleText('boost', `You cast mend on ${name}, healing ${incr} damage!`));
    await actor.perform('affect', { hp: incr });
  },
]);
