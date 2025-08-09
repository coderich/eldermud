const { Action } = require('@coderich/gameflow');

Action.define('arcanist', [
  (_, { actor }) => {
    const key = `talent.arcanist.${actor}`;
    actor.$effects.set(key, { effect: { manaforce: -1000 } });
  },
]);
