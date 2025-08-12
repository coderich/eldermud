const { Action } = require('@coderich/gameflow');

Action.define('marksman', [
  (_, { actor }) => {
    const key = `trait.marksman.${actor}`;
    actor.$effects.set(key, { effect: { acc: 3, tracking: 3 } });
  },
]);
