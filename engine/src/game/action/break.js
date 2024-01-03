const { Action } = require('@coderich/gameflow');

Action.define('break', [
  async (_, { actor }) => {
    return actor.streams.action.abort();
    // return actor.stream('action', new Action()); // Stream an empty action to abort any attack
  },
]);
