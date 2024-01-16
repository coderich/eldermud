const { Action } = require('@coderich/gameflow');

/**
 * Initiate basic attack with whatever weapon is in hand
 */
Action.define('attack', [
  ({ target }, { actor, stream, abort }) => {
    if (!target) abort('You dont see that here!');
    target.killers ??= new Set();
    stream.once('add', abort);
    target.once('post:death', abort);
  },

  // Engage with the target
  ({ target }, { actor, stream, promise }) => {
    actor.send('text', APP.styleText('engaged', `*combat engaged (${target.name})*`));

    APP.timeout(2000).then(() => {
      if (!promise.aborted) {
        target.killers.add(actor);
        const attack = APP.randomElement(actor.attacks);
        actor.stream(stream, 'swing', { target, attack });
      }
    });
  },
]);
