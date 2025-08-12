const { Action } = require('@coderich/gameflow');

Action.define('shadowdancer', [
  (_, { actor }) => {
    const key = `trait.shadowdancer.${actor}`;
    actor.$effects.set(key, { effect: { crits: 3, dodge: 3, stealth: 3 } });
  },
]);
