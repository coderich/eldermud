const { Action } = require('@coderich/gameflow');

Action.define('look', [
  async ({ args }, { actor, abort }) => {
    const [dir] = args;
    const { exits } = CONFIG.get(await REDIS.get(`${actor}.room`));
    const room = exits?.[dir];
    if (!room) return abort('There is no exit in that direction!');
    return actor.perform('room', room);
  },
]);
