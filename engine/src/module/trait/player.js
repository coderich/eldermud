const { Action } = require('@coderich/gameflow');

Action.define('player', [
  (_, { actor }) => {
    actor.stream('trait', 'warning');
    actor.stream('trait', 'lifeforce');
    actor.stream('trait', 'manaforce');
  },
]);
