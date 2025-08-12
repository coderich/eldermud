const { Action, Loop } = require('@coderich/gameflow');

SYSTEM.on('start:spawn', ({ actor }) => {
  actor.$countdowns = new Map();

  REDIS.keys(`countdown:${actor}*`).then(async (keys) => {
    const values = keys.length ? await REDIS.mGet(keys) : keys;
    keys.forEach((key, i) => actor.stream('effect', 'countdown', {
      save: false,
      key: key.split(':')[2],
      value: Number(values[i]),
    }));
  });
});

Action.define('countdown', [
  ({ key, value, save = true }, { actor, promise }) => {
    actor.$countdowns.set(key, value);
    const redisKey = `countdown:${actor}:${key}`;
    if (save) REDIS.set(redisKey, value);

    promise.finally(() => {
      if (promise.reason === null) { // null includes death
        actor.$countdowns.delete(key);
        REDIS.del(redisKey);
      } else {
        REDIS.set(redisKey, actor.$countdowns.get(key));
      }
    });
  },

  new Loop(async ({ key }, { actor, abort }) => {
    await APP.timeout(1000);
    actor.$countdowns.set(key, actor.$countdowns.get(key) - 1000);
    if (actor.$countdowns.get(key) <= 0) abort(null);
  }),
]);
