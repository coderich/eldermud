const { Action } = require('@coderich/gameflow');

Action.define('break', [
  async (_, { actor }) => {
    actor.send('text', APP.styleText('engaged', '*break*'));
    Object.values(actor.streams).filter(stream => stream.id !== 'trait').forEach(stream => stream.abort());
  },
]);
