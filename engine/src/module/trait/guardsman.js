const { Action } = require('@coderich/gameflow');

Action.define('guardsman', [
  (_, { actor }) => {
    actor.stream('trait', 'lifeforce');
    // actor.stream('trait', 'vagabond');
    actor.stream('trait', 'wary');
  },
]);
