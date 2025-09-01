const { Action } = require('@coderich/gameflow');

Action.define('expGain', [
  async ({ exp }, { actor }) => {
    return Promise.all([
      actor.perform('affect', { exp }),
      actor.writeln(`You collect ${APP.styleText('keyword', exp)} remnants of the dead.`),
    ]);
  },
]);
