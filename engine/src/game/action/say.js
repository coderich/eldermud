const { Action } = require('@coderich/gameflow');

Action.define('say', [
  (input, { actor }) => {
    actor.send('text', `You say "${input}"`);
    actor.broadcast('text', `${actor.name} says "${input}"`);
  },
]);
