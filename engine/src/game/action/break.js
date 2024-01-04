const { Action } = require('@coderich/gameflow');

Action.define('break', [
  async (_, { actor }) => {
    actor.send('text', '> break <');
    Object.values(actor.streams).forEach(stream => stream.abort());
  },
]);
