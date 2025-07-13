const { Action, Loop } = require('@coderich/gameflow');

Action.define('effect', [
  (effect, { actor, promise, stream, abort }) => {
    const key = `${effect.source}.${effect.target}`;
    const source = CONFIG.get(`${effect.source}`);
    const abortMessage = `The effects of ${source.name} wear off`;

    // Abort silently duplicate effects
    const preEffect = ({ data }) => `${data.source}.${data.target}` === key && abort(false);
    actor.on('pre:effect', preEffect);

    // Cleanup
    promise.finally(() => {
      actor.off('pre:effect', preEffect);
      actor.$affects.delete(key);
      actor.calcStats();

      if (promise.reason === abortMessage) {
        REDIS.del(key);
      } else if (promise.reason !== false) {
        REDIS.set(key, JSON.stringify(effect));
      }
    });

    // Take immediate (first) affect
    if (effect.apply === 'dynamic') {
      actor.$affects.set(key, effect.affect);
      actor.calcStats();
    } else {
      actor.perform('affect', effect.affect);
    }

    return { effect, abortMessage };
  },
  new Loop(async ({ effect, abortMessage }, { actor, abort }) => {
    await APP.timeout(1000);
    effect.duration -= 1000;

    // if (effect.apply !== 'dynamic') {
    //   actor.perform('affect', effect.affect);
    // }

    if (effect.duration <= 0) abort(abortMessage);
  }),
]);
