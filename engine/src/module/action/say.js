const { Action } = require('@coderich/gameflow');

Action.define('say', [
  (input, { actor }) => {
    const text = APP.styleText('dialog', input);

    return Promise.all([
      actor.send('text', `${actor.name}: ${text}`),
      actor.broadcast('text', `${actor.name}: ${text}`),
    ]);
  },
]);
