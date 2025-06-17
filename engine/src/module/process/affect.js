const { Action } = require('@coderich/gameflow');

Action.define('affect', async (resources, { actor }) => {
  return Promise.all(Object.entries(resources).map(([key, value]) => {
    return REDIS.incrBy(`${actor}.${key}`, value);
  })).then((values) => {
    const keys = Object.keys(resources);
    const data = values.reduce((prev, value, i) => Object.assign(prev, { [keys[i]]: value }), {});
    actor.assign(data);
    return data;
  });
});
