const { Action } = require('@coderich/gameflow');

Action.define('ask', [
  async ({ args }, { actor, abort }) => {
    const { units } = CONFIG.get(await REDIS.get(`${actor}.room`));
    const { target, rest } = APP.target(units, args);
    if (!target) return abort('You dont see that here!');
    actor.socket.emit('text', `You ask ${target.name} your questions.`);
    return { target, rest };
  },
]);
