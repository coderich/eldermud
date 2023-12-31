const { Action } = require('@coderich/gameflow');

Action.define('break', [
  async (_, { actor }) => {
    return actor.streams.action.abort();
  },
]);
