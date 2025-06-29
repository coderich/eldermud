const { Action } = require('@coderich/gameflow');

Action.define('door', [
  (_, { actor, stream }) => {
    console.log('a door');
  },
]);
