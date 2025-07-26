const { Action } = require('@coderich/gameflow');

Action.define('enter', [
  async (_, { actor }) => {
    await actor.perform('onboard');
    await actor.realm('text', `${APP.styleText(actor.type, actor.name)} enters the realm.`);
    await actor.perform('spawn');
  },
]);
