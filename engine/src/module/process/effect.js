const { Actor, Action, Loop } = require('@coderich/gameflow');

SYSTEM.on('post:enter', ({ actor }) => {
  REDIS.keys(`effect:*.${actor}`).then(async (keys) => {
    const values = keys.length ? await REDIS.mGet(keys) : keys;
    keys.forEach((key, i) => {
      const value = JSON.parse(values[i]);
      value.restored = true; // Restored from DB after connect
      actor.stream('effect', 'effect', value);
    });
  });
});

const performAffect = async (target, $affect) => {
  const stats = await target.mGet('hp', 'mhp', 'ma', 'mma');
  if ($affect.hp !== undefined) $affect.hp = Math.min(stats.mhp - stats.hp, $affect.hp);
  if ($affect.ma !== undefined) $affect.ma = Math.min(stats.mma - stats.ma, $affect.ma);
  return target.perform('affect', $affect);
};

Action.define('effect', [
  (effect, context) => {
    const { duration, permanent, once } = effect;
    const { promise, abort } = context;
    const key = `effect:${effect.source}.${effect.target}`;

    // Prevent one-time effects from being repeated
    if (once && (effect.restored || context.actor.$effects.has(key))) return abort();

    //
    const target = context.actor;
    const actor = Object.values(Actor).find(a => `${a}` === `${effect.actor}`);
    const $affect = Object.entries(effect.affect || {}).reduce((prev, [k, v]) => Object.assign(prev, { [k]: APP.roll(v) }), {});
    // const $effect = Object.entries(effect.effect || {}).reduce((prev, [k, v]) => Object.assign(prev, { [k]: APP.roll(v) }), {});

    // Setup the effect
    REDIS.set(key, JSON.stringify(effect));
    if (effect.effect) target.$effects.set(key, effect);
    if (effect.affect) performAffect(target, $affect);
    if (effect.action) Object.entries(effect.action).forEach(([action, data]) => actor.perform(action, { ...data, target }));
    target.calcStats();

    // Effect notifications
    if (effect.message && !effect.restored) {
      const msg = APP.interpolate(effect.message, { actor, target, affect: $affect });
      target.send('text', APP.styleText(effect.style, msg));
    }

    // Abort silently duplicate effect
    const preEffect = ({ data }) => `effect:${data.source}.${data.target}` === key && abort(false);
    target.on('pre:effect', preEffect);

    // Cleanup
    promise.finally(() => {
      target.off('pre:effect', preEffect);

      // Remove effect
      if (!permanent) {
        target.$effects.delete(key);
        target.calcStats();
      }

      // Figure out if this effect ran it's course or the target died...
      if (duration) {
        if (promise.reason === effect.cooloff || promise.reason === null) { // null means death
          REDIS.del(key);
        } else if (promise.reason !== false) {
          REDIS.set(key, JSON.stringify(effect));
        }
      }
    });

    return effect.duration ? { $affect, effect, target } : abort(false);
    // if (!effect.duration) abort(false);
    // return { $affect, effect, target };
  },

  // Duration loop
  new Loop(async ({ $affect, effect, target }, { abort }) => {
    await APP.timeout(1000);
    effect.duration -= 1000;
    if (effect.duration && $affect) performAffect(target, $affect);
    if (effect.duration <= 0) abort(effect.cooloff);
  }),
]);
