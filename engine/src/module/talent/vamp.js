const { Action } = require('@coderich/gameflow');

/**
 */
Action.define('vamp', [
  ({ target }, { abort }) => {
    if (!target) abort('You dont see that here!');
  },

  ({ target }, { actor, stream }) => {
    const attack = CONFIG.get('talent.vamp');
    actor.stream(stream, 'engage', { target, attack });
  },
]);
