const { Action } = require('@coderich/gameflow');

Action.define('talent', [
  ({ talent, target }, { actor, stream }) => {
    actor.unshift(stream, 'act', { act: talent, target });
  },
]);
