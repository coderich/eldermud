const { Action, Loop } = require('@coderich/gameflow');

Action.define('effect', [
  (effect, { actor, promise, abort }) => {
    const key = `${effect.source}.${effect.target}`;
    const source = CONFIG.get(`${effect.source}`);
    const abortMessage = `The effects of ${source.name} wear off`;

    // Take immediate (first) affect
    if (effect.apply === 'dynamic') {
      actor.$affects.set(key, effect.affect);
      actor.calcStats();
    } else {
      actor.perform('affect', effect.affect);
    }

    promise.onAbort(async () => {
      actor.$affects.delete(key);
      actor.calcStats();

      if (promise.reason === abortMessage) {
        REDIS.del(key);
      } else {
        REDIS.set(key, JSON.stringify(effect));
      }
    });

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
