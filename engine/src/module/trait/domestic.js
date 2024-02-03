const { Action } = require('@coderich/gameflow');

Action.define('domestic', [
  (_, context) => {
    context.actor.on('pre:attack', ({ data, abort }) => {
      if (data.target.type === 'player') abort();
    });
  },
]);
