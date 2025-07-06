const { Action } = require('@coderich/gameflow');

/**
 */
Action.define('mmis', [
  ({ target }, { abort, actor }) => {
    if (!target) abort('You dont see that here!');
    return target;
  },

  async (target, { actor, abort }) => {
    const talent = CONFIG.get('talent.magicMissle');
    const name = target === actor ? 'yourself' : target.name;
    if (await actor.get('ma') < talent.cost) return abort('Insufficient resources!');
    await actor.perform('affect', { ma: -talent.cost });
    await APP.instantiate(talent, { target, lvl: 1, duration: 20000 });
    return actor.send('text', APP.styleText('boost', `You cast ${talent.name} on ${name}!`));
  },
]);
