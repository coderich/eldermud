const { Action } = require('@coderich/gameflow');

Action.define('lifeforce', [
  (_, { actor, promise, stream }) => {
    let aborted = false;
    const abortFn = () => (aborted = true);
    stream.once('abort', abortFn);

    APP.timeout(2500).then(async () => {
      if (!promise.aborted) {
        const { hp } = await actor.mGet('hp');
        const incr = Math.min(actor.mhp - hp, 2);
        actor.perform('affect', { hp: incr });
      }

      if (!aborted) actor.stream(stream, 'lifeforce');
      stream.off('abort', abortFn);
    });
  },
]);
