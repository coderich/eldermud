const { Action } = require('@coderich/gameflow');

Action.define('weaponsmaster', [
  (_, { actor }) => {
    const key = `trait.weaponsmaster.${actor}`;
    actor.$effects.set(key, { effect: { ac: 2, acc: 3, block: 3 } });
  },
]);
