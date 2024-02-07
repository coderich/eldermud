const { Action } = require('@coderich/gameflow');

Action.define('search', [
  async ({ target }, { actor, abort }) => {
    if (!target) abort('There is nothing to see there!');
  },

  async ({ target }, { actor }) => {
    switch (target.type) {
      case 'room': {
        const items = Array.from(target.items.values()).filter(item => item.hidden && item.owner === `${actor}`);
        actor.$search = new Set(items);
        if (items.length) actor.send('text', 'You notice', items.map(item => item.name).join(', '), 'here.');
        else actor.send('text', 'Your search reveals nothing.');
        break;
      }
      default: {
        break;
      }
    }
  },
]);
