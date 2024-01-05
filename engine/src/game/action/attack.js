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

    const credit = () => {
      target.killers ??= new Set();
      target.killers.add(actor);
      actor.perform('break');
    };

    target.once('pre:death', credit);

    actor.once('post:break', () => {
      abort();
      stream.open();
      target.off('post:death', credit);
      actor.send('text', '*combat off*');
    });

    Util.timeout(2000).then(() => {
      const swing = async () => {
        await Util.timeout(2000);
        if (promise.aborted) return stream.resume();

        /**
         * Here we perform the swing. Recovery time cannot be averted so we pause the stream
         */
        stream.pause();
        const dmg = APP.roll('3d10');
        await actor.perform('damage', { target, dmg });
        await Util.timeout(2000);

        return promise.aborted ? stream.resume() : swing();
      };

      if (!promise.aborted) swing();
    });

    return target;
  },
]);
