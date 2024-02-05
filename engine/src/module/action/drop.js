const { Action } = require('@coderich/gameflow');

Action.define('drop', [
  async ({ target }, { abort, actor }) => {
    return target || abort('You dont have that!');
  },
  async (target, { actor }) => {
    await REDIS.sRem(`${actor}.inventory`, `${target}`);
    await REDIS.set(`${target}.room`, `${actor.room}`);
    console.log(Object.getPrototypeOf(target));
    target.room = actor.room;
    actor.room.items.add(target);
    actor.send('text', `You dropped ${target.name}.`);
    actor.broadcast('text', `${actor.name} dropped ${target.name}.`);
  },
]);
