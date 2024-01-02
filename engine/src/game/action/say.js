const { Action } = require('@coderich/gameflow');

Action.define('say', [
  (input, { actor }) => {
    actor.send('text', `You say "${input}"`);
  },
]);
