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
    actor.writeln(`You dropped ${target.name}`);
    actor.broadcast(`${actor.name} dropped ${target.name}`);
  },
]);
