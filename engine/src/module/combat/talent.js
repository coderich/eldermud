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

  // Message
  ({ talent, target }, { actor }) => {
    if (talent.message) {
      const [verb, ...rest] = talent.message.split(' ');
      const target1 = actor === target ? 'yourself' : target.name;
      const target2 = actor === target ? 'themself' : target.name;
      actor.send('text', APP.styleText(talent.style, ['You', verb, ...rest, target1].join(' ')));
      actor.broadcast('text', APP.styleText(talent.style, [actor.name, APP.pluralize(verb), ...rest, target2].join(' ')));
    }
  },

  // Manifestation (effects)
  ({ talent, target }, { actor }) => {
    return talent.effects.map(async (effect) => {
      const $target = effect.target === 'self' ? actor : target;
      effect = { ...effect, source: `${talent}`, actor: `${actor}`, target: `${$target}` };
      return $target.stream('effect', 'effect', effect);
    });
  },
]);
