const { Action } = require('@coderich/gameflow');

Action.define('close', [
  ({ target }, { abort, actor }) => {
    if (!target) abort('There is nothing to open!');
    if (target.status !== 'open') abort(`The ${target.name} is not open!`);
  },
  ({ target }, { actor, abort }) => {
    switch (target.type) {
      case 'door': {
        CONFIG.set(`${target}.status`, 'closed');
        actor.perform('map');
        return actor.send('text', `You close the ${target.name}.`);
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
