const { Action } = require('@coderich/gameflow');

/**
 * Because lifeforce is a pulse (that can be aborted) we have to manually perform a loop
 */
Action.define('lifeforce', [
  (_, { actor, promise, stream }) => {
    let aborted = false;
    const abortFn = () => (aborted = true);
    stream.once('abort', abortFn);

    APP.timeout(10000).then(async () => {
      if (!promise.aborted) {
        const { hp } = await actor.mGet('hp');
        const incr = Math.min(actor.mhp - hp, 2);
        if (incr > 0) actor.perform('affect', { hp: incr });
      }

      if (!aborted) actor.stream(stream, 'lifeforce');
      stream.off('abort', abortFn);
    });
  },
]);
