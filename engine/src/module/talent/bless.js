const { Action } = require('@coderich/gameflow');

/**
 */
Action.define('bless', [
  ({ talent, target }, { abort, actor }) => {
    target ??= actor;
    return { target, talent };
  },

  async ({ target, talent }, { actor, abort }) => {
    const name = target === actor ? 'yourself' : target.name;
    if (await actor.get('ma') < talent.cost) return abort('Insufficient resources!');
    await actor.perform('affect', { ma: -talent.cost });
    await APP.instantiate(talent, { target, lvl: 1, duration: 20000 });
    return actor.send('text', APP.styleText('boost', `You cast ${talent.name} on ${name}!`));
  },
]);
