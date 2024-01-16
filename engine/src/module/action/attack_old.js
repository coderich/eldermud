const { Action } = require('@coderich/gameflow');

/**
 * Perform a basic attack with whatever weapon is in hand
 */
Action.define('attack_old', [
  ({ target }, { abort }) => {
    if (!target) abort('You dont see that here!');
  },
  ({ target }, { actor, abort, stream, promise }) => {
    // Engage
    actor.send('text', APP.styleText('engaged', `*combat engaged (${target.name})*`));
    stream.close('You cannot do that while attacking; BREAK first!');

    // On Victory
    const victory = () => {
      target.killers ??= new Set();
      target.killers.add(actor);
      actor.perform('break');
    };

    target.once('pre:death', victory);

    actor.once('post:break', () => {
      abort();
      stream.open();
      target.off('post:death', victory);
      actor.send('text', '*combat off*');
    });

    // Time to engage
    APP.timeout(2000).then(() => {
      const swing = async () => {
        await APP.timeout(2000);
        if (promise.aborted) return stream.resume();

        /**
         * Here we perform the swing. Recovery time cannot be averted so we pause the stream
         */
        stream.pause();
        const attack = APP.randomElement(actor.attacks);
        await actor.perform('swing', { attack, target });
        await APP.timeout(2000);

        return promise.aborted ? stream.resume() : swing();
      };

      if (!promise.aborted) swing();
    });
  },
]);
