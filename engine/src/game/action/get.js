const { Action } = require('@coderich/gameflow');

Action.define('get', [
  async ({ args }, { abort, actor }) => {
    const name = args.join(' ');
    const target = Array.from(actor.roomSearch.values()).find(item => item.name.toLowerCase().indexOf(name) === 0);
    return target || abort('You dont see that here!');
  },
  async (target, { actor }) => {
    actor.roomSearch.delete(target);
    const $target = await APP.instantiate(`${target}`);
    await REDIS.sAdd(`${actor}.inventory`, `${$target}`);
    actor.socket.emit('text', `You take the ${target.name}`);
  },
]);
