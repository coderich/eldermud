const { Action } = require('@coderich/gameflow');

Action.define('look', [
  async ({ target }, { actor, abort }) => {
    if (!target) return abort('There is nothing to see there!');

    switch (target.type) {
      case 'room': return actor.perform('room', target);
      default: return actor.send('text', target.description);
    }
  },
]);
