const { Action } = require('@coderich/gameflow');

Action.define('proficient', [
  (_, { actor }) => {
    actor.on('pre:expGain', (event) => {
      event.data.exp = Math.ceil(event.data.exp * 1.10);
    });
  },
]);
