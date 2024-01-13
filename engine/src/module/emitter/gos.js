const { Action, Actor } = require('@coderich/gameflow');

Action.define('gos', [
  async ({ args }, { actor }) => {
    Object.values(Actor).forEach(act => act.send('gos', `${actor.name}:`, args.join(' ')));
  },
]);
