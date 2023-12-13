const { Action } = require('@coderich/gameflow');

Action.define('ask', [
  async (command, context) => {
    const { args } = command;
    const { actor } = context;
    const { units } = CONFIG.get(await REDIS.get(`${actor}.room`));
    const { target, rest } = APP.target(units, args);

    if (!target) return actor.socket.emit('text', 'You dont see that here!');
    if (!target?.ask) return actor.socket.emit('text', `${target.name} has nothing to say to you.`);
    return target.ask(rest);
  },
]);
