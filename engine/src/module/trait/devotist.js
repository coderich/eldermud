const { Action } = require('@coderich/gameflow');

// Consider making this effect for the entire party
Action.define('devotist', [
  (_, { actor }) => {
    const key = `trait.devotist.${actor}`;
    actor.$effects.set(key, { effect: { lifeforce: -1000 } });
  },
]);
