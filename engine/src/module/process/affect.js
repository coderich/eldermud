const { Action } = require('@coderich/gameflow');

Action.define('affect', async (resources, { actor }) => {
  return Promise.all(Object.entries(resources).map(([key, value]) => {
    return REDIS.incrBy(`${actor}.${key}`, APP.roll(value));
  })).then(async (values) => {
    await actor.calcStats?.();
    const keys = Object.keys(resources);
    return values.reduce((prev, value, i) => Object.assign(prev, { [keys[i]]: value }), {});
  });
});
