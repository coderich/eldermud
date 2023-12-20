const { Action } = require('@coderich/gameflow');

Action.define('say', [
  ({ input }, { actor }) => {
    actor.socket.emit('text', `You say "${input}"`);
  },
]);
