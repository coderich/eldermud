const { Action } = require('@coderich/gameflow');

Action.define('help', [
  async (_, { actor }) => {
    actor.socket.emit('table', {
      name: 'help',
      columns: ['Col1', 'Col2', 'Col3'],
      rows: ['data1', 'data2', 'data3'],
    });
  },
]);
