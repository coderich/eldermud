const Util = require('@coderich/util');
const { Action } = require('@coderich/gameflow');

/**
 * Perform a basic attack with whatever weapon is in hand
 */
Action.define('attack', [
  ({ target }, { actor, abort, stream, promise }) => {
    if (!target) return abort('You dont see that here!');

    // Engage
    actor.send('text', `*combat engaged (${target.name})*`);
    stream.close('You cannot do that while attacking; BREAK first!');
    actor.once('post:break', () => {
      stream.open();
      abort();
      actor.send('text', '*combat off*');
    });

    Util.timeout(5000).then(() => {
      const swing = async () => {
        await Util.timeout(2000);
        if (promise.aborted) return stream.resume();

        /**
         * Here we perform the swing. Recovery time cannot be averted so we pause the stream
         */
        stream.pause();
        const dmg = APP.roll('1d3+1');
        await actor.perform('damage', { target, dmg });
        await Util.timeout(2000);

        return promise.aborted ? stream.resume() : swing();
      };

      if (!promise.aborted) swing();
    });

    return target;
  },
]);
