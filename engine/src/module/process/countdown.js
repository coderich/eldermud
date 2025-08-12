const { Action, Loop } = require('@coderich/gameflow');

// SYSTEM.on('post:enter', ({ actor }) => {
//   REDIS.keys(`talent.*.${actor}.cooldown`).then(async (keys) => {
//     const values = keys.length ? await REDIS.mGet(keys) : keys;
//     keys.forEach((key, i) => actor.stream('effect', 'countdown', { key, value: Number(values[i]) }));
//   });
// });

Action.define('countdown', [
  async (data, { promise }) => {
    if (data.save) await REDIS.set(data.key, data.value);

    promise.finally(() => {
      if (promise.reason === null) REDIS.del(data.key); // null includes death
      else REDIS.set(data.key, data.value);
    });
  },
  new Loop(async (data, { abort }) => {
    await APP.timeout(1000);
    data.value -= 1000;
    if (data.value <= 0) abort(null);
  }),
]);
