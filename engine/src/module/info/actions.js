const { Action } = require('@coderich/gameflow');

Action.define('actions', [
  async (_, { actor }) => {
    return actor.writeln(APP.table([
      ['a', 'b', 'c'],
      ['d', 'e', 'f'],
      ['g', 'h', 'i'],
    ]));
  },
]);
