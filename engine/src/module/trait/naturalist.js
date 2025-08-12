const { Action } = require('@coderich/gameflow');

Action.define('naturalist', [
  (_, { actor }) => {
    const key = `trait.naturalist.${actor}`;
    actor.$effects.set(key, { effect: { ac: 1, lifeforce: -1000 } });
  },
]);
