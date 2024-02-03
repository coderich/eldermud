const { Action } = require('@coderich/gameflow');

Action.define('onboard', async (_, { actor }) => {
  await actor.perform('selectClass');
});
