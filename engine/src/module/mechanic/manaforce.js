const { Action } = require('@coderich/gameflow');

/**
 * Because manaforce is a pulse (that can be aborted) we have to manually perform a loop
 */
Action.define('manaforce', [
  (_, { actor, promise, stream }) => {
    let aborted = false;
    const abortFn = () => (aborted = true);
    stream.once('abort', abortFn);

    APP.timeout(10000).then(async () => {
      if (!promise.aborted) {
        const { ma } = await actor.mGet('ma');
        const incr = Math.min(actor.mma - ma, 2);
        actor.perform('affect', { ma: incr });
      }

      if (!aborted) actor.stream(stream, 'manaforce');
      stream.off('abort', abortFn);
    });
  },
]);
