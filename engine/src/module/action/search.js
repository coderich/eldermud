const { Action } = require('@coderich/gameflow');

Action.define('search', [
  async ({ target }, { actor, abort }) => {
    if (!target) abort('There is nothing to see there!');
    actor.send('text', 'You beging searching...');
  },

  () => APP.timeout(250),

  async ({ target }, { actor }) => {
    switch (target.type) {
      case 'room': {
        const items = Array.from(target.items.values()).filter(item => item.hidden && item.owner === `${actor}`);
        actor.$search = new Set(items);
        return items.length ? actor.send('text', 'You notice', items.map(item => item.name).join(', '), 'here.') : actor.send('text', 'Your search reveals nothing.');
      }
      default: {
        return actor.send('text', 'You cannot search that...');
      }
    }
  },
]);
