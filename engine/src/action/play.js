const { Action } = require('@coderich/gameflow');

Action.define('play', (_, { actor }) => {
  actor.perform('map');
});
