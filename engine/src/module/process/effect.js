const { Actor, Action, Loop } = require('@coderich/gameflow');

SYSTEM.on('post:enter', ({ actor }) => {
  REDIS.keys(`effect:*.${actor}`).then(async (keys) => {
    Promise.all(keys.map(async (key) => {
      const effect = JSON.parse(await REDIS.get(key));
      actor.$effects.set(key, effect);
      return actor.stream('effect', 'effect', effect);
    })).then(() => actor.calcStats());
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
    const { duration, permanent } = effect;
    const { promise, abort } = context;
    const key = `effect:${effect.source}.${effect.target}`;

    // Normalize
    const target = context.actor;
    const actor = Object.values(Actor).find(a => `${a}` === `${effect.actor}`);
    const $affect = Object.entries(effect.affect || {}).reduce((prev, [k, v]) => Object.assign(prev, { [k]: APP.roll(v) }), {});
    // const $effect = Object.entries(effect.effect || {}).reduce((prev, [k, v]) => Object.assign(prev, { [k]: APP.roll(v) }), {});

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

    if (!target.$effects.has(key)) {
      // Effect message
      if (effect.message) {
        const msg = APP.interpolate(effect.message, { actor, target, affect: $affect });
        target.writeln(APP.styleText(effect.style, msg));
      }

      // Perform the effect
      if (duration || permanent) REDIS.set(key, JSON.stringify(effect));
      if (effect.effect) target.$effects.set(key, effect);
      if (effect.affect) performAffect(target, $affect);
      // if (effect.action) Object.entries(effect.action).forEach(([action, data]) => actor.perform(action, { ...data, target }));
      target.calcStats();
    }

    return effect.duration ? { $affect, effect, target } : abort(false);
  },

  // Duration loop
  new Loop(async ({ $affect, effect, target }, { abort }) => {
    await APP.timeout(1000);
    effect.duration -= 1000;
    if (effect.duration && $affect) performAffect(target, $affect);
    if (effect.duration <= 0) abort(effect.cooloff);
  }),
]);
