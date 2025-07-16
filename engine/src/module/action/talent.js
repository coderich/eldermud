const { Action } = require('@coderich/gameflow');

Action.define('talent', [
  ({ talent, target }, { abort, actor }) => {
    if (!target) abort('You dont see that here!');
  },

  // Gesture
  ({ talent }, { actor }) => {
    if (talent.gesture) {
      const [verb, ...rest] = talent.gesture.split(' ');
      actor.send('text', APP.styleText('gesture', ['You', verb, 'your', ...rest].join(' ')));
      actor.broadcast('text', APP.styleText('gesture', [actor.name, APP.pluralize(verb), 'their', ...rest].join(' ')));
    }

    return APP.timeout(talent.speed);
  },

  // Resource check
  async ({ talent }, { actor, abort }) => {
    if (await actor.get('ma') < talent.cost) abort('Insufficient resources!');
    else await actor.perform('affect', { ma: -talent.cost });
  },

  // Execute talent (effects)
  ({ talent, target }, { actor }) => {
    return talent.effects.map(async (effect) => {
      effect = { ...effect, source: `${talent}`, actor: `${actor}`, target: `${target}` };
      return target.stream('effect', 'effect', effect);
    });
  },
]);
