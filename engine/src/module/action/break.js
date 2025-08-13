const { Action } = require('@coderich/gameflow');

Action.define('break', [
  async (_, { actor }) => {
    actor.send('text', APP.styleText('engaged', '*break*'));
    actor.streams.realm.abort();
    actor.streams.action.abort();
  },
]);
