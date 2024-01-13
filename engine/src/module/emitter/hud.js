const { Action } = require('@coderich/gameflow');

Action.define('hud', [
  async (_, { actor }) => {
    const [hp] = await REDIS.mGet([`${actor}.hp`]);
    actor.send('text', `hp: ${hp}`);
  },
]);
