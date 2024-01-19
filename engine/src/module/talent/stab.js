const { Action } = require('@coderich/gameflow');

/**
 */
Action.define('stab', [
  (_, { actor, abort }) => {
    if (!actor.$engaged) return abort('You must be engaged in combat!');
    return actor.$target;
  },

  async (target, { actor }) => {
    const stab = CONFIG.get('talent.stab');
    const dmg = APP.roll(stab.dmg);
    actor.send('text', APP.styleText('youHit', `You surprise stab ${target.name}, dealing ${dmg} damage!`));
    await target.perform('affect', { hp: -dmg });
  },
]);
