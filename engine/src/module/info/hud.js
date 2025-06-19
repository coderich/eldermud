const { Action } = require('@coderich/gameflow');

Action.define('hud', [
  async (_, { actor }) => {
    const hp = await actor.get('hp');
    actor.send('text', `hp: ${hp}`);
  },
]);
