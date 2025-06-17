const { Action } = require('@coderich/gameflow');

Action.define('onboard', async (_, { actor }) => {
  const info = await actor.mGet('class', 'race');
  if (!info.class) await actor.perform('selectClass');
  // if (!info.race) await actor.perform('selectRace');
});
