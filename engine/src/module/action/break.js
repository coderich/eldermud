const { Action } = require('@coderich/gameflow');

Action.define('break', [
  async (_, { actor }) => {
    actor.writeln(APP.styleText('engaged', '*break*'));
    actor.streams.realm.abort();
    actor.streams.action.abort();
  },
]);
