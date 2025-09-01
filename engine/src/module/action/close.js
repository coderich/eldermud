const { Action } = require('@coderich/gameflow');

Action.define('close', [
  ({ target }, { abort, actor }) => {
    if (!target) abort('There is nothing to close!');
    else if (target.status !== 'open') abort(`The ${target.name} is not open!`);
  },
  async ({ target }, { actor, abort }) => {
    switch (target.type) {
      case 'door': {
        CONFIG.set(`${target}.status`, 'closed');
        const room = CONFIG.get(await actor.get('room'));
        room.units.forEach(unit => unit.perform('map'));
        return Promise.all([
          actor.writeln(`You close the ${target.name}`),
          actor.broadcast(`${APP.styleText(actor.type, actor.name)} closes the ${target.name}`),
        ]);
      }
      case 'chest': {
        return null;
      }
      default: {
        return null;
      }
    }
  },
]);
