const { Actor, Action, Loop } = require('@coderich/gameflow');

const performAffect = async (actor, affect) => {
  const $affect = { ...affect };
  const stats = await actor.mGet('hp', 'mhp', 'ma', 'mma');
  if ($affect.hp !== undefined) $affect.hp = Math.min(stats.mhp - stats.hp, APP.roll($affect.hp));
  if ($affect.ma !== undefined) $affect.ma = Math.min(stats.mma - stats.ma, APP.roll($affect.ma));
  actor.perform('affect', $affect);
};

Action.define('effect', [
  (effect, { actor, promise, stream, abort }) => {
    const key = `${effect.source}.${effect.target}`;
    const source = CONFIG.get(`${effect.source}`);
    const attack = CONFIG.get(`${effect.attack}`);
    const abortMessage = `The effects of ${source.name} wear off`;
    const { duration } = effect;

    // Setup the effect
    if (duration) REDIS.set(key, JSON.stringify(effect));
    if (effect.effect) actor.$effects.set(key, effect);
    if (effect.affect) performAffect(actor, effect.affect);
    if (effect.strike) Object.values(Actor).find(a => `${a}` === `${effect.actor}`).perform('strike', { target: actor, attack: effect.strike });
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
  new Loop(async ({ effect, abortMessage }, { actor, abort }) => {
    await APP.timeout(1000);
    effect.duration -= 1000;

    // if (effect.tick && effect.duration % effect.tick === 0) {
    //   if (effect.affect) actor.perform('affect', sanitizeAffect(effect.affect));
    // }

    if (effect.duration <= 0) abort(abortMessage);
  }),
]);
