const { Actor, Action, Loop } = require('@coderich/gameflow');

Action.define('effect', [
  (effect, { actor, promise, stream, abort }) => {
    const key = `${effect.source}.${effect.target}`;
    const source = CONFIG.get(`${effect.source}`);
    const attack = CONFIG.get(`${effect.attack}`);
    const abortMessage = `The effects of ${source.name} wear off`;

    // Setup the effect
    if (effect.duration) REDIS.set(key, JSON.stringify(effect));
    if (effect.effect) actor.$effects.set(key, effect.effect);
    if (effect.affect) actor.perform('affect', effect.affect);
    if (effect.attack) Object.values(Actor).find(a => `${a}` === `${effect.actor}`).stream('action', 'engage', { target: actor, attack });
    actor.calcStats();

    // Abort silently duplicate effect
    const preEffect = ({ data }) => `${data.source}.${data.target}` === key && abort(false);
    actor.on('pre:effect', preEffect);

    // Cleanup
    promise.finally(() => {
      actor.off('pre:effect', preEffect);
      actor.$effects.delete(key);
      actor.calcStats();

      if (effect.duration) {
        if (promise.reason === abortMessage) {
          REDIS.del(key);
        } else if (promise.reason !== false) {
          REDIS.set(key, JSON.stringify(effect));
        }
      }
    });

    if (!effect.duration) abort(false);
    return { effect, abortMessage };
  },
  new Loop(async ({ effect, abortMessage }, { actor, abort }) => {
    await APP.timeout(1000);
    effect.duration -= 1000;

    // if (effect.tick && effect.duration % effect.tick === 0) {
    //   if (effect.affect) actor.perform('affect', effect.affect);
    // }

    if (effect.duration <= 0) abort(abortMessage);
  }),
]);
