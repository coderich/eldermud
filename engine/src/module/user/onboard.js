const { Action } = require('@coderich/gameflow');

Action.define('onboard', async (_, { actor }) => {
  return actor.perform('selectClass');
});
