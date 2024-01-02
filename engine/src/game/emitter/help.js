const { Action } = require('@coderich/gameflow');

Action.define('help', [
  async (_, { actor }) => {
    actor.send('table', {
      name: 'help',
      columns: [{ name: 'NAME', width: 20 }, { name: 'DESCRIPTION', width: 75 }, { name: 'QTY', width: 10 }],
      rows: [['data1', 'data2', 'data3']],
    });
  },
]);
