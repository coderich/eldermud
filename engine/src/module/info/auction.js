const { Action, Actor } = require('@coderich/gameflow');

Action.define('auction', [
  async ({ args }, { actor }) => {
    Object.values(Actor).forEach(act => act.send('auc', `${actor.name}:`, args.join(' ')));
  },
]);
