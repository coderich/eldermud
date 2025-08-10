const { Action } = require('@coderich/gameflow');

Action.define('guardsman', [
  (_, { actor }) => {
    actor.stream('trait', 'warning');
    actor.stream('trait', 'lifeforce');
    // actor.stream('trait', 'vagabond');
    actor.stream('trait', 'chase');
    actor.stream('trait', 'wary');
  },
]);
