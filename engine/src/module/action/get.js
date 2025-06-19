const { Action } = require('@coderich/gameflow');

Action.define('get', [
  async ({ target }, { abort, actor }) => {
    return target || abort('You dont see that here!');
  },
  async (target, { actor }) => {
    actor.$search.delete(target);
    const room = CONFIG.get(await actor.get('room'));
    room.items.delete(target);
    await REDIS.del(`${target}.room`);
    await REDIS.del(`${target}.hidden`);
    // await REDIS.sRem(`${target.container}.inventory`, `${target}`); // This needed?
    await REDIS.sAdd(`${actor}.inventory`, `${target}`);
    actor.send('text', `You took ${target.name}`);
    actor.broadcast('text', `${actor.name} took ${target.name}`);
  },
]);
