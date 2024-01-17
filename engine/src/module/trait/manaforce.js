const { Action } = require('@coderich/gameflow');

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
