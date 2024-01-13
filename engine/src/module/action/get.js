const { Action } = require('@coderich/gameflow');

Action.define('get', [
  async ({ target }, { abort, actor }) => {
    return target || abort('You dont see that here!');
  },
  async (target, { actor }) => {
    actor.roomSearch.delete(target);
    CONFIG.get(target.room).items.delete(target);
    await REDIS.del(`${target}.room`);
    await REDIS.sAdd(`${actor}.inventory`, `${target}`);
    actor.send('text', `You take the ${target.name}`);
  },
]);
