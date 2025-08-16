const { Action } = require('@coderich/gameflow');

SYSTEM.on('post:enter', ({ actor }) => {
  // Talent effects
  REDIS.keys(`talent.*.${actor}`).then(async (keys) => {
    const values = keys.length ? await REDIS.mGet(keys) : keys;
    keys.forEach((key, i) => actor.stream('effect', 'effect', JSON.parse(values[i])));
  });
});

Action.define('talent', [
  ({ talent, target }, { actor }) => {
    return actor.perform('invoke', { invocation: talent, target });
  },
]);
