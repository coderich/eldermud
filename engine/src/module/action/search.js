const { Action } = require('@coderich/gameflow');

Action.define('search', [
  async ({ target }, { actor, abort }) => {
    if (!target) abort('Your search reveals nothing');
  },

  async ({ target }, { actor }) => {
    switch (target.type) {
      case 'room': {
        const items = Array.from(target.items.values()).filter(item => item.hidden && item.owner === `${actor}`);
        actor.$search = new Set(items);
        if (items.length) actor.writeln('You notice', items.map(item => item.name).join(', '), 'here');
        else actor.writeln('Your search reveals nothing');
        break;
      }
      default: {
        break;
      }
    }
  },
]);
