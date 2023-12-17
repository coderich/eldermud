const { Action } = require('@coderich/gameflow');

Action.define('greet', [
  async ({ args }, { actor, abort }) => {
    if (args.length) {
      const name = args.join(' ');
      const { units } = CONFIG.get(await REDIS.get(`${actor}.room`));
      const target = Array.from(units.values()).find(unit => unit.name.toLowerCase().indexOf(name) === 0);
      if (!target) return abort('You dont see that here!');
      actor.socket.emit('text', `You greet ${target.name}.`);
      return { target };
    }

    return abort('You greet everybody.');
  },
]);
