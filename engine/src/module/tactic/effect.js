const { Actor, Action, Loop } = require('@coderich/gameflow');

const performAffect = async (actor, $affect) => {
  const stats = await actor.mGet('hp', 'mhp', 'ma', 'mma');
  if ($affect.hp !== undefined) $affect.hp = Math.min(stats.mhp - stats.hp, $affect.hp);
  if ($affect.ma !== undefined) $affect.ma = Math.min(stats.mma - stats.ma, $affect.ma);
  return actor.perform('affect', $affect);
};

Action.define('effect', [
  (effect, { actor, promise, stream, abort }) => {
    const key = `${effect.source}.${effect.target}`;
    const source = CONFIG.get(`${effect.source}`);
    const abortMessage = `The effects of ${source.name} wear off`;
    const { duration } = effect;

    //
    const $target = actor;
    const $actor = Object.values(Actor).find(a => `${a}` === `${effect.actor}`);
    const $affect = Object.entries(effect.affect || {}).reduce((prev, [k, v]) => Object.assign(prev, { [k]: APP.roll(v) }), {});
    // const $effect = Object.entries(effect.effect || {}).reduce((prev, [k, v]) => Object.assign(prev, { [k]: APP.roll(v) }), {});

    // Setup the effect
    if (duration) REDIS.set(key, JSON.stringify(effect));
    if (effect.effect) actor.$effects.set(key, effect);
    if (effect.affect) performAffect(actor, $affect);
    if (effect.action) Object.entries(effect.action).forEach(([action, data]) => $actor.perform(action, { ...data, target: $target }));
    actor.calcStats();

    // Effect notifications
    if (effect.message) {
      $actor.interpolate(effect.message, { actor: $actor, target: $target, affect: $affect }, { style: effect.style });
    }

    // Abort silently duplicate effect
    const preEffect = ({ data }) => `${data.source}.${data.target}` === key && abort(false);
    actor.on('pre:effect', preEffect);

    // Cleanup
    promise.finally(() => {
      actor.off('pre:effect', preEffect);
      actor.$effects.delete(key);
      actor.calcStats();

      if (duration) {
        if (promise.reason === abortMessage || promise.reason === null) { // null means death
          REDIS.del(key);
        } else if (promise.reason !== false) {
          REDIS.set(key, JSON.stringify(effect));
        }
      }
    });

    if (!effect.duration) abort(false);
    return { effect, abortMessage };
  },
  new Loop(async ({ $affect, effect, abortMessage }, { actor, abort }) => {
    await APP.timeout(1000);
    effect.duration -= 1000;
    if (effect.duration && $affect) performAffect(actor, $affect);
    if (effect.duration <= 0) abort(abortMessage);
  }),
]);
