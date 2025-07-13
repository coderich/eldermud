const { Action } = require('@coderich/gameflow');

Action.define('talent', [
  ({ talent, target }, { abort, actor }) => {
    if (!target) abort('You dont see that here!');
  },

  // Gesture
  async ({ talent }, { actor }) => {
    const [verb, ...rest] = talent.gesture.split(' ');

    await Promise.all([
      actor.send('text', APP.styleText('gesture', ['You', verb, 'your', ...rest].join(' '))),
      actor.broadcast('text', APP.styleText('gesture', [actor.name, APP.pluralize(verb), 'their', ...rest].join(' '))),
      APP.timeout(talent.delay),
    ]);
  },

  // Resource check
  async ({ talent }, { actor, abort }) => {
    if (await actor.get('ma') < talent.cost) abort('Insufficient resources!');
    else await actor.perform('affect', { ma: -talent.cost });
  },

  // Apply effects
  async ({ talent, target }, { actor }) => {
    return Promise.all(talent.effects.map(async (effect) => {
      effect = { ...effect, source: `${talent}`, actor: `${actor}`, target: `${target}` };
      await REDIS.set(`${talent}.${target}`, JSON.stringify(effect));
      target.stream('effect', 'effect', effect);
    }));
  },
]);
