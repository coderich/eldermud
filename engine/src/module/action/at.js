const { Action } = require('@coderich/gameflow');

Action.define('at', [
  async ({ target, rest }, { actor, abort }) => {
    if (!target) return abort('You dont see that here!');
    const text = APP.styleText('dialog', rest.join(' '));
    return Promise.all([
      actor.send('text', `${actor.name} (to ${target.name}): ${text}`),
      target.send('text', `${actor.name}: ${text}`),
      // actor.broadcast('text', `${actor.name} (to ${target.name}): ${text}`),
    ]);
  },
]);
