const { Action } = require('@coderich/gameflow');

Action.define('drop', [
  async ({ target }, { abort, actor }) => {
    return target || abort('You dont have that!');
  },
  async (target, { actor }) => {
    const room = CONFIG.get(await actor.get('room'));
    await REDIS.sRem(`${actor}.inventory`, `${target}`);
    await REDIS.set(`${target}.room`, `${room}`);
    room.items.add(target);
    actor.send('text', `You dropped ${target.name}`);
    actor.broadcast('text', `${actor.name} dropped ${target.name}`);
  },
]);
