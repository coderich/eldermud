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
    const effect = { source: `${talent}`, actor: `${actor}`, target: `${target}`, apply: 'dynamic', affect: { wis: 5, dex: 5 }, loops: 1, interval: 0, duration: 20000 };
    await REDIS.set(`${talent}.${target}`, JSON.stringify(effect));
    target.stream('effect', 'effect', effect);
    return actor.send('text', APP.styleText('boost', `You cast ${talent.name} on ${name}!`));
  },
]);
