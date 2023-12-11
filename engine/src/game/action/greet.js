const { Action } = require('@coderich/gameflow');

Action.define('greet', [
  async (command, context) => {
    const { args } = command;
    const { actor } = context;

    if (args.length) {
      const name = args.join(' ');
      const { units } = CONFIG.get(await REDIS.get(`${actor}.room`));
      const target = Array.from(units.values()).find(unit => unit.name.toLowerCase().indexOf(name) === 0);
      return target ? Promise.resolve(actor.socket.emit('text', `You greet ${target.name}.`)).then(() => {
        target.greet?.(context);
      }) : actor.socket.emit('text', 'You dont see that here!');
    }

    return actor.socket.emit('text', 'You greet everybody.');
  },
]);
