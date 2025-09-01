const { Action } = require('@coderich/gameflow');

Action.define('at', [
  async ({ target, rest }, { actor, abort }) => {
    if (!target) return abort('You dont see that here!');
    // const text = APP.styleText('dialog', rest.join(' '));
    const text = rest.join(' ');

    return Promise.all([
      actor.writeln(`${actor.name} (to ${target.name}): ${text}`),
      target.writeln(`${actor.name}: ${text}`),
      // actor.broadcast(`${actor.name} (to ${target.name}): ${text}`),
    ]);
  },
]);
