const { Action } = require('@coderich/gameflow');

Action.define('door', [
  ({ room }, { actor, stream }) => {
    console.log('a door');
  },
]);
